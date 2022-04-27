import { Controller, Post, Req } from '@nestjs/common';
import { logger } from 'app/libs/logger';
import { NoteValidationService } from './services/note-validation.service';

type WebhookRequest = Express.Request & { body: any };

@Controller('/note')
export class NoteController {
  constructor(private readonly noteValidationService: NoteValidationService) {}

  @Post()
  async onNoteWebhook(@Req() req: WebhookRequest) {
    console.log(req.body);
    if (
      this.noteValidationService.shouldHandle(req.body) &&
      this.noteValidationService.validatePayload(req.body)
    ) {
      const { object_attributes } = req.body;
      const { action } = object_attributes;
      logger.log(`Received mr event with action ${action}`);
    }
  }
}
