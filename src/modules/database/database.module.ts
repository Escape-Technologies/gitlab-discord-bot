import { Module } from '@nestjs/common';
import { DatabaseClient } from './database.service';

@Module({
  providers: [DatabaseClient],
  exports: [DatabaseClient],
})
export class DatabaseModule {}
