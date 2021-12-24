import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { MessageEmbed } from 'discord.js';
import bot from '../../bot';
import { userManager } from '../../managers';
import { MrOpenedWebhookPayload } from '../../server/dtos/mr-opened.interface';
import gitlabClient from '../../utils/gitlab-client';
import logger from '../../utils/logger';
import { EventHandler, EventPayload } from '../entities';

function notifyChannelForMR(
  author: Omit<UserSchema, 'created_at'>,
  projectName: string,
  mrTitle: string,
  mrUrl: string
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const channel = bot.mrChannel!;

  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`New merge request opened by ${author.username}`)
        .setColor('#409bd7')
        .setDescription(
          `A new merge request has been opened on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`
        )
        .setThumbnail(
          'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png'
        )
        .setTimestamp()
    ]
  });
}

function notifyAssigneesForMR(
  gitlabIds: string[],
  author: Omit<UserSchema, 'created_at'>,
  projectName: string,
  mrTitle: string,
  mrUrl: string
) {
  gitlabIds.forEach(async (gitlabId: any) => {
    logger.info(`Notifying watchers of assignee ${gitlabId}`);
    const stored = await userManager.get(gitlabId);
    const idsToNotify = stored?.watchers || [];
    idsToNotify.forEach((id: string) => {
      logger.info(`Notifying  ${id}`);
      const user = bot._bot.users.cache.get(id);
      if (user) {
        logger.info(`Notifying user ${id} for mr ${mrTitle}`);
        user.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Assigned on a merge request by ${author.username}`)
              .setColor('#409bd7')
              .setDescription(
                `A new merge request has been opened on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`
              )
              .setThumbnail(
                'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png'
              )
              .setTimestamp()
          ]
        });
      } else {
        logger.warn(`User ${id} not in cache`);
      }
    });
  });
}

const mrCreatedHandler: EventHandler = async (
  payload: EventPayload<MrOpenedWebhookPayload>
) => {
  const { object_attributes: mr, project, assignees } = payload.data;

  const author = await gitlabClient.Users.show(mr.author_id);
  const isDraft = mr.title.includes('Draft:');

  if (!isDraft) {
    notifyChannelForMR(author, project.name, mr.title, mr.url);

    if (assignees) {
      notifyAssigneesForMR(
        assignees.map((a) => a.username),
        author,
        project.name,
        mr.title,
        mr.url
      );
    }
  } else {
    logger.warn(`Skipping merge request ${mr.id} because it is drafted`);
  }
};

export default mrCreatedHandler;
