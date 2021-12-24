import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { MessageEmbed } from 'discord.js';
import bot from '../../bot';
import { userManager } from '../../managers';
import { MrClosedWebhookPayload } from '../../server/dtos/mr-closed.interface';
import gitlabClient from '../../utils/gitlab-client';
import { EventPayload } from '../entities';

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
        .setTitle(`Merge request closed by ${author.username}`)
        .setColor(0xff0000)
        .setDescription(
          `A merge request has been closed on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`
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
    console.log(`notifying watchers of assignee ${gitlabId}`);
    const stored = await userManager.get(gitlabId);
    const idsToNotify = stored?.watchers || [];
    idsToNotify.forEach((id: string) => {
      console.log(`notifying  ${id}`);
      const user = bot._bot.users.cache.get(id);
      if (user) {
        console.log(`notifying user ${id} for mr ${mrTitle}`);
        user.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Merge request closed by ${author.username}`)
              .setColor(0xff0000)
              .setDescription(
                `A merge request has been closed on repository **${projectName}**.\n\n**[${mrTitle}](${mrUrl})**`
              )
              .setThumbnail(
                'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png'
              )
              .setTimestamp()
          ]
        });
      } else {
        console.log(`User ${id} not in cache`);
      }
    });
  });
}

export default async function handlerMrClosed(
  payload: EventPayload<MrClosedWebhookPayload>
) {
  const { project, object_attributes: mr, assignees } = payload.data;
  const author = await gitlabClient.Users.show(mr.author_id);
  const isDraft = mr.title.includes('Draft:');

  // Don't notify for drafted merge request
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
    console.log(`Skipping merge request ${mr.id} because it is drafted`);
  }
}
