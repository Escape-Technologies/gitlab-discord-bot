import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { Injectable } from '@nestjs/common';
import { GitlabClient } from 'app/libs/gitlab/client';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { DiscordService } from 'app/modules/discord/discord.service';
import { MessageEmbed } from 'discord.js';
import { MrOpenedWebhookPayload } from '../../../libs/gitlab/dtos/mr-opened.interface';

@Injectable()
export class MergeRequestOpenedService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly discord: DiscordService,
    private readonly gitlab: GitlabClient,
  ) {}

  async notifyChannelForMR(
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
          .setTitle(`New merge request opened by ${author.username}`)
          .setColor('#409bd7')
          .setDescription(
            `A new merge request has been opened on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`,
          )
          .setThumbnail(
            'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
          )
          .setTimestamp(),
      ],
    });
  }

  async notifyAssigneesForMR(
    gitlabUsernames: string[],
    author: Omit<UserSchema, 'created_at'>,
    projectName: string,
    mrTitle: string,
    mrUrl: string,
  ) {
    for (const gitlabUsername of gitlabUsernames) {
      logger.log(`Notifying watchers of assignee ${gitlabUsername}`);

      const trackers = await this.db.tracker.findMany({
        where: {
          gitlabUsername,
        },
        include: { user: true },
      });

      // We don't want to specify one very specific case of assignee: The author of the MR assigns himself on it.
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

      for (const id of idsToNotify) {
        logger.log(`Notifying ${id}`);
        const user = this.discord.users.cache.get(id);
        if (user) {
          logger.log(`Notifying user ${id} for mr ${mrTitle}`);
          user.send({
            embeds: [
              new MessageEmbed()
                .setTitle(`Assigned on a merge request by ${author.username}`)
                .setColor('#409bd7')
                .setDescription(
                  `A new merge request has been opened on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`,
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
      }
    }
  }

  async handleMrOpenedWebhook(payload: MrOpenedWebhookPayload) {
    const { object_attributes: mr, project, assignees } = payload;

    const author = await this.gitlab.Users.show(mr.author_id);
    const isDraft = mr.title.includes('Draft:');

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
