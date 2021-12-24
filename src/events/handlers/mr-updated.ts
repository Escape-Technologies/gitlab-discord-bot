import { MessageEmbed } from 'discord.js';
import bot from '../../bot';
import { userManager } from '../../managers';
import { MrUpdateWebhookPayload } from '../../server/dtos/mr-updated.interface';
import gitlabClient from '../../utils/gitlab-client';
import { EventPayload } from '../entities';

function notifyUndraftedMergeRequest(
  authorUsername: string,
  projectName: string,
  mrTitle: string,
  mrUrl: string
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const channel = bot.mrChannel!;

  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`New merge request opened by ${authorUsername}`)
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

function notifyAssignees(
  gitlabIds: string[],
  authorUsername: string,
  authorUrl: string,
  mrTitle: string,
  mrUrl: string,
  repositoryName: string
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
              .setTitle(
                `Assigned on merge request on repository ${repositoryName}`
              )
              .setColor(0xff0000)
              .setDescription(
                `[${authorUsername}](${authorUrl}) asked you to review this merge request: [${mrTitle}](${mrUrl})`
              )
          ]
        });
      } else {
        console.log(`User ${id} not in cache`);
      }
    });
  });
}

export default async function handleMrUpdated(
  event: EventPayload<MrUpdateWebhookPayload>
) {
  const payload = event.data;
  const { changes } = payload;
  const undrafted = changes.title && !changes.title.current.includes('Draft:');

  const author = await gitlabClient.Users.show(
    payload.object_attributes.author_id
  );

  if (undrafted) {
    notifyUndraftedMergeRequest(
      author.username,
      payload.repository.name,
      payload.object_attributes.title,
      payload.object_attributes.url
    );

    notifyAssignees(
      (payload.assignees || []).map((user) => user.username),
      author.username,
      author.web_url,
      payload.object_attributes.title,
      payload.object_attributes.url,
      payload.repository.name
    );
  } else {
    if (changes.assignees) {
      const assignChanges = changes.assignees;
      const ids = assignChanges.current
        .filter(
          (cur) => !assignChanges.previous.find((prev) => cur.id === prev.id)
        )
        .map((n) => n.username);
      notifyAssignees(
        ids,
        author.username,
        author.web_url,
        payload.object_attributes.title,
        payload.object_attributes.url,
        payload.repository.name
      );
    }
  }
}
