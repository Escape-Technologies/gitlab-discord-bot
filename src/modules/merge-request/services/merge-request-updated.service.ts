import { Injectable } from '@nestjs/common';
import { gitlabClient } from 'app/libs/gitlab/client';
import { MrUpdateWebhookPayload } from '../../../libs/gitlab/dtos/mr-updated.interface';
import { MergeRequestOpenedService } from './merge-request-opened.service';

@Injectable()
export class MergeRequestUpdatedService {
  constructor(
    private readonly mergeRequestOpenedService: MergeRequestOpenedService,
  ) {}

  async handleMrUpdatedWebhook(payload: MrUpdateWebhookPayload) {
    const { changes } = payload;
    const undrafted =
      changes.title && !changes.title.current.includes('Draft:');

    const author = await gitlabClient.Users.show(
      payload.object_attributes.author_id,
    );

    if (undrafted) {
      this.mergeRequestOpenedService.notifyChannelForMR(
        author,
        payload.repository.name,
        payload.object_attributes.title,
        payload.object_attributes.url,
      );

      this.mergeRequestOpenedService.notifyAssigneesForMR(
        (payload.assignees || []).map((user) => user.username),
        author,
        payload.repository.name,
        payload.object_attributes.title,
        payload.object_attributes.url,
      );
    } else {
      if (changes.assignees) {
        const assignChanges = changes.assignees;
        const ids = assignChanges.current
          .filter(
            (cur) => !assignChanges.previous.find((prev) => cur.id === prev.id),
          )
          .map((n) => n.username);
        this.mergeRequestOpenedService.notifyAssigneesForMR(
          ids,
          author,
          payload.object_attributes.title,
          payload.object_attributes.url,
          payload.repository.name,
        );
      }
    }
  }
}
