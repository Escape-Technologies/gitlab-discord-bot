import { Controller, Post, Req } from '@nestjs/common';
import { NoteReceivedWebhookPayload } from 'app/libs/gitlab/dtos/note-received.interface';
import { logger } from 'app/libs/logger';
import { NoteReceivedService } from './services/note-received.service';
import { NoteValidationService } from './services/note-validation.service';

type WebhookRequest = Express.Request & { body: any };

@Controller('/note')
export class NoteController {
  constructor(
    private readonly noteValidationService: NoteValidationService,
    private readonly noteReceivedService: NoteReceivedService,
  ) {}

  @Post()
  async onNoteWebhook(@Req() req: WebhookRequest) {
    if (
      this.noteValidationService.shouldHandle(req.body) &&
      this.noteValidationService.validatePayload(req.body)
    ) {
      logger.log(`Received note event`);

      this.noteReceivedService.handleNoteReceived(
        req.body as NoteReceivedWebhookPayload,
      );
    }
  }
}
