import { Injectable, Logger } from '@nestjs/common';
import { GitlabClient } from 'app/libs/gitlab/client';
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

  /**
   * Handle the gitlab webhook for a note being added to a merge request.
   * @param payload The payload received from Gitlab for this event
   * @returns
   */
  async handleNoteReceived(payload: NoteReceivedWebhookPayload) {
    const {
      object_attributes: note,
      merge_request: mergeRequest,
      project_id: projectId,
      user: author,
    } = payload;

    const discussion = await this.gitlab.MergeRequestDiscussions.show(
      projectId,
      mergeRequest.iid,
      //@ts-expect-error error
      note.discussion_id,
    );

    const messageEmbed = this.buildEmbed(
      author.username,
      author.username,
      note,
      mergeRequest,
    );

    if (!discussion.notes || discussion.notes.length === 1) {
      if (author.id === note.author_id) {
        return;
      }
      this.notifyStandaloneMessageAuthor(author.username, messageEmbed);
    } else {
      this.notifyDiscussionMembers(discussion, messageEmbed);
    }
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

  /**
   * Send notifications when a new discussion is opened on a merge request.
   * This fuction sends a discord private message to every user tracking the author of a merge request
   *
   * @param mrAuthorUsername The Gitlab username of the author of the merge request
   * @param messageEmbed  The embed to send to the trackers of the mr author
   */
  async notifyStandaloneMessageAuthor(
    mrAuthorUsername: string,
    messageEmbed: MessageEmbed,
  ) {
    const idsToNotify = await this.db.tracker.findMany({
      where: {
        gitlabUsername: mrAuthorUsername,
      },
      include: {
        user: true,
      },
    });

    for (const tracker of idsToNotify) {
      const user = this.discord.users.cache.get(tracker.user.discordId);
      if (user) {
        user.send({
          embeds: [messageEmbed],
        });
      } else {
        this.logger.warn(`Discord user ${tracker.userId} not found`);
      }
    }
  }

  /**
   * Send notifications when a running discussion receives a note on a merge request.
   * This fuction sends a discord private message to every user tracking every member of the discussion,
   * excepted the one who published the last note in the discussion
   *
   * @param discussion The Gitlab discussion which received a new note
   * @param messageEmbed  The embed to send to the trackers of the mr author
   */
  async notifyDiscussionMembers(
    discussion: DiscussionSchema,
    messageEmbed: MessageEmbed,
  ) {
    if (!discussion.notes || discussion.notes.length === 1) {
      throw new Error(
        `Received a discussion object with less than 2 notes: discussion.notes = ${discussion.notes}`,
      );
    }

    // Retrieve the last message
    const lastNote = discussion.notes.pop();

    // Define user to notify: In the case of a running discussion, we notify everyone but the last author
    // of a message in the discussion
    const allDiscussionMembers: string[] = discussion.notes
      .map((message) => message.author.username as string)
      .filter((username) => username !== lastNote.author.username);
    const uniqueDiscussionMembers = [...new Set(allDiscussionMembers)];

    // Retrieve the before last message
    const beforeLastNote = discussion.notes.pop();

    const trackers = await this.db.tracker.findMany({
      where: {
        gitlabUsername: { in: uniqueDiscussionMembers },
      },
      include: {
        user: true,
      },
    });

    // Override the descripion of the default embed with a short history of the last messages being exchanged in the discussion
    const message = `*[${beforeLastNote.created_at}] \`${beforeLastNote.author.username}\` said:*\n${beforeLastNote.body}\n*[${beforeLastNote.created_at}] \`${lastNote.author.username}\` said:*\n${lastNote.body}`;

    // Send a notification to every tracker of the usernames we defined above
    for (const tracker of trackers) {
      messageEmbed.setDescription(message);
      messageEmbed.setFooter({
        text: `You received this notification, because the Gitlab username "${tracker.gitlabUsername}" is involved in a discussion, which received a new comment.`,
      });
      const user = this.discord.users.cache.get(tracker.user.discordId);
      if (user) {
        user.send({
          embeds: [messageEmbed],
        });
      } else {
        this.logger.warn(`Discord user ${tracker.userId} not found`);
      }
    }
  }
}
