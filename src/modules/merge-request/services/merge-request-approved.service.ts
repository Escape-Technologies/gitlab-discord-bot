import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { Injectable } from '@nestjs/common';
import { GitlabClient } from 'app/libs/gitlab/client';
import { MrApprovedWebhookPayload } from 'app/libs/gitlab/dtos/mr-approved.interface';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { DiscordService } from 'app/modules/discord/discord.service';
import { MessageEmbed } from 'discord.js';

@Injectable()
export class MergeRequestApprovedService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly discord: DiscordService,
    private readonly gitlab: GitlabClient,
  ) {}

  async notifyAssigneesForApproval(
    gitlabUsernames: string[],
    author: Omit<UserSchema, 'created_at'>,
    projectName: string,
    mrTitle: string,
    mrUrl: string,
  ) {
    for (const gitlabUsername of gitlabUsernames) {
      logger.log(
        `Notifying assignee ${gitlabUsername} for '${projectName}/${mrTitle}' approval`,
      );

      const trackers = await this.db.tracker.findMany({
        where: {
          gitlabUsername,
        },
        include: { user: true },
      });

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
                .setTitle(
                  `Merge request ${mrTitle} approved by ${author.username}`,
                )
                .setColor('#409bd7')
                .setDescription(
                  `A merge request your are assigned on **${projectName}** has been approved.\n\n**[${mrTitle}](${mrUrl})**`,
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

  async handlerMergeRequestApproved(payload: MrApprovedWebhookPayload) {
    const { assignees, object_attributes, project } = payload;

    const author = await this.gitlab.Users.show(object_attributes.author_id);
    const isDraft = object_attributes.title.includes('Draft:');
    if (isDraft) {
      logger.warn(
        `Skipping merge request ${object_attributes.id} because it is drafted`,
      );
    } else {
      if (assignees) {
        this.notifyAssigneesForApproval(
          assignees.map((a) => a.username),
          author,
          project.name,
          object_attributes.title,
          object_attributes.url,
        );
      }
    }
  }
}
