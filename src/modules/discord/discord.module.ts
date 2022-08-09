import { Module } from '@nestjs/common';
import { DatabaseModule } from 'app/modules/database/database.module';
import { CommandsModule } from './commands/commands.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [DatabaseModule, CommandsModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
