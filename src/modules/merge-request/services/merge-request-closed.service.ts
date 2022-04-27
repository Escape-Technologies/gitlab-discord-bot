import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { Injectable } from '@nestjs/common';
import { GitlabClient } from 'app/libs/gitlab/client';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { DiscordService } from 'app/modules/discord/discord.service';
import { MessageEmbed } from 'discord.js';
import { MrClosedWebhookPayload } from '../../../libs/gitlab/dtos/mr-closed.interface';

@Injectable()
export class MergeRequestClosedService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly discord: DiscordService,
    private readonly gitlab: GitlabClient,
  ) {}

  notifyChannelForMR(
    author: Omit<UserSchema, 'created_at'>,
    projectName: string,
    mrTitle: string,
    mrUrl: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const channel = this.discord.mrChannel!;

    channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Merge request closed by ${author.username}`)
          .setColor(0xff0000)
          .setDescription(
            `A merge request has been closed on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`,
          )
          .setThumbnail(
            'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
          )
          .setTimestamp(),
      ],
    });
  }

  notifyAssigneesForMR(
    gitlabIds: string[],
    author: Omit<UserSchema, 'created_at'>,
    projectName: string,
    mrTitle: string,
    mrUrl: string,
  ) {
    gitlabIds.forEach(async (gitlabId: any) => {
      logger.log(`Notifying watchers of assignee ${gitlabId}`);

      const trackers = await this.db.tracker.findMany({
        where: {
          gitlabUsername: gitlabId,
        },
        include: { user: true },
      });

      // We don't want to specify one very specific case of assignee: The author of the MR/event assigns himself on it.
      // So we filter every tracker where the username in the tracker is the same as the one of the author, AND
      // the tracker is attached to a user who is the author
      const idsToNotify = trackers
        .filter(
          (tracker) =>
            !(
              tracker.gitlabUsername === author.username &&
              tracker.user.gitlabUsername === author.username
            ),
        )
        .map((tracker) => tracker.user.discordId);

      idsToNotify.forEach((id: string) => {
        logger.log(`Notifying  ${id}`);
        const user = this.discord.users.cache.get(id);
        if (user) {
          logger.log(`Notifying user ${id} for mr ${mrTitle}`);
          user.send({
            embeds: [
              new MessageEmbed()
                .setTitle(`Merge request closed by ${author.username}`)
                .setColor(0xff0000)
                .setDescription(
                  `A merge request on which you were assigned has been closed on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`,
                )
                .setThumbnail(
                  'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
                )
                .setTimestamp(),
            ],
          });
        } else {
          logger.warn(`User ${id} not in cache`);
        }
      });
    });
  }

  async handlerMergeRequestClosed(payload: MrClosedWebhookPayload) {
    const { project, object_attributes: mr, assignees } = payload;
    const author = await this.gitlab.Users.show(mr.author_id);
    const isDraft = mr.title.includes('Draft:');

    // Don't notify for drafted merge request
    if (!isDraft) {
      this.notifyChannelForMR(author, project.name, mr.title, mr.url);

      if (assignees) {
        this.notifyAssigneesForMR(
          assignees.map((a) => a.username),
          author,
          project.name,
          mr.title,
          mr.url,
        );
      }
    } else {
      logger.warn(`Skipping merge request ${mr.id} because it is drafted`);
    }
  }
}
