import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [CommandsModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
