import { Injectable, Logger } from '@nestjs/common';
import { GitlabClient } from 'app/libs/gitlab/client';
import { User } from 'app/libs/gitlab/dtos/common';
import { NoteReceivedWebhookPayload } from 'app/libs/gitlab/dtos/note-received.interface';
import { DatabaseClient } from 'app/modules/database/database.service';
import { DiscordService } from 'app/modules/discord/discord.service';
import { MessageEmbed } from 'discord.js';

@Injectable()
export class NoteReceivedService {
  logger = new Logger();

  constructor(
    private readonly gitlab: GitlabClient,
    private readonly db: DatabaseClient,
    private readonly discord: DiscordService,
  ) {}

  async notifyInvolvedUsers(
    messageEmbed: MessageEmbed,
    author: User,
    involvedUsernames: string[],
  ) {
    for (const gitlabUsername of involvedUsernames) {
      if (gitlabUsername === author.username) {
        continue;
      }

      this.logger.log(`Notifying user ${gitlabUsername} for note received`);
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
        const user = this.discord.users.cache.get(id);
        if (user) {
          this.logger.log(`Sending message to user ${user.username}`);
          user.send({
            embeds: [messageEmbed],
          });
        } else {
          this.logger.warn(`User ${id} not in cache`);
        }
      }
    }
  }

  /**
   * Handle the gitlab webhook for a note being added to a merge request.
   * @param payload The payload received from Gitlab for this event
   * @returns
   */
  async handleNoteReceived(payload: NoteReceivedWebhookPayload) {
    const {
      object_attributes: note,
      project_id: projectId,
      user: author,
    } = payload;

    const mergeRequest = await this.gitlab.MergeRequests.show(
      projectId,
      payload.merge_request.iid,
    );

    const assigneesUsernames = mergeRequest.assignees.map(
      (assignee) => assignee.username,
    ) as string[];
    const reviewersUsernames = mergeRequest.reviewers.map(
      (reviewer) => reviewer.username,
    ) as string[];

    const involvedUsersUsernames =
      assigneesUsernames.concat(reviewersUsernames);

    const messageEmbed = this.buildEmbed(
      author.username,
      author.username,
      note,
      mergeRequest,
    );

    this.notifyInvolvedUsers(messageEmbed, author, involvedUsersUsernames);
  }

  /**
   * Build the embed to send when a discussion is opened/answered
   *
   * @param trackerGitlabUsername
   * @param authorUsername the username of the author of the note
   * @param note the note that triggered the webhook
   * @param mergeRequest the merge request on which this note exists
   * @returns
   */
  buildEmbed<
    N extends { url: string; description: string },
    M extends { iid: number },
  >(
    trackerGitlabUsername: string,
    authorUsername: string,
    note: N,
    mergeRequest: M,
  ) {
    return new MessageEmbed()
      .setTitle(`New note received on a merge request`)
      .setColor('#409bd7')
      .setURL(note.url)
      .setDescription(`*${authorUsername} said:*\n${note.description}`)
      .setThumbnail(
        'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
      )
      .setFooter({
        text: `You received this notification, because the Gitlab username "${trackerGitlabUsername}" is involved in a discussion on merge request !${mergeRequest.iid}, which received a new comment.`,
      })
      .setTimestamp();
  }
}
