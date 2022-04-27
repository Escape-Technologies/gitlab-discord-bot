import { Module } from '@nestjs/common';
import { DatabaseModule } from 'app/modules/database/database.module';
import { DropCommandService } from './services/drop.service';
import { RegisterCommandService } from './services/register.service';
import { UnregisterCommandService } from './services/unregister.service';
import { WatchCommandService } from './services/watch.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    DropCommandService,
    RegisterCommandService,
    WatchCommandService,
    UnregisterCommandService,
  ],
  exports: [
    DropCommandService,
    RegisterCommandService,
    WatchCommandService,
    UnregisterCommandService,
  ],
})
export class CommandsModule {}
