import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DiscordModule } from '../discord/discord.module';
import { GitlabModule } from '../gitlab-client.module';
import { NoteController } from './note.controller';
import { NoteReceivedService } from './services/note-received.service';
import { NoteValidationService } from './services/note-validation.service';

@Module({
  imports: [GitlabModule, DatabaseModule, DiscordModule],
  providers: [NoteValidationService, NoteReceivedService],
  controllers: [NoteController],
})
export class NoteModule {}
