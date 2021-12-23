import { UserSchema } from '@gitbeaker/core/dist/types/types';
import { MessageEmbed } from 'discord.js';
import bot from '../../bot';
import { mrManager } from '../../managers';
import gitlabClient from '../../utils/gitlab-client';
import { EventHandler, EventPayload, MrCreatedEventPayload } from '../entities';

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

const mrCreatedHandler: EventHandler = async (
  payload: EventPayload<MrCreatedEventPayload>
) => {
  const { projectId, mrId } = payload.data;

  const project = await gitlabClient.Projects.show(projectId);
  const projectMrs = await gitlabClient.MergeRequests.all({
    projectId
  });
  const mr = projectMrs.find((mr) => mr.id === mrId);
  if (!mr) {
    throw new Error(`Found no mr with id ${mrId} on project ${projectId}`);
  }

  const isDraft = mr.title.includes('Draft:');

  // In every case, update the store with the current merge request, or create it
  mrManager.store(mr.id, {
    state: mr.state,
    id: mr.id,
    title: mr.title,
    draft: isDraft,
    assignees: (mr.assignees || []).map((a) => a.username as string),
    reviewers: (mr.reviewers || []).map((r) => r.username as string)
  });

  if (!isDraft) {
    notifyChannelForMR(mr.author, project.name, mr.title, mr.web_url);
  } else {
    console.log(`Skipping merge request ${mr.id} because it is drafted`);
  }
};

export default mrCreatedHandler;
