import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteValidationService } from './services/note-validation.service';

@Module({
  providers: [NoteValidationService],
  controllers: [NoteController],
})
export class NoteModule {}
