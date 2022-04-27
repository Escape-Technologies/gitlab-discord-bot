import { Injectable } from '@nestjs/common';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { CommandResult } from 'app/modules/discord/commands/entities';
import { Message } from 'discord.js';

@Injectable()
export class UnregisterCommandService {
  constructor(private readonly db: DatabaseClient) {}

  async unregister(message: Message): Promise<CommandResult> {
    const discordUserId = message.author.id;
    logger.log(
      `Running unregister command with discord user ${discordUserId}}`,
    );
    try {
      await this.db.user.delete({
        where: {
          discordId: discordUserId,
        },
      });
      return {
        result: {
          message: `Succesfully unregistered \`{ discordId: ${discordUserId} }\``,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        error: `Account deletion failed`,
      };
    }
  }
}
