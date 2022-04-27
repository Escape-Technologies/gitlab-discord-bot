import { Module } from '@nestjs/common';
import { MergeRequestModule } from './modules/merge-request/merge-request.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [MergeRequestModule, NoteModule],
})
export class AppModule {}
