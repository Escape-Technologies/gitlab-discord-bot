import { Injectable } from '@nestjs/common';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { CommandResult } from 'app/modules/discord/commands/entities';
import { Message } from 'discord.js';

@Injectable()
export class DropCommandService {
  constructor(private readonly db: DatabaseClient) {}

  async drop(message: Message): Promise<CommandResult> {
    const authorDiscordId = message.author.id;
    const toUnwatch = message.content.split(' ')[1];

    if (!toUnwatch) {
      return {
        error: `Invalid username provided.`,
      };
    }

    logger.log(`Running drop command with gitlab user ${toUnwatch}`);
    try {
      const user = await this.db.user.findUnique({
        where: {
          discordId: authorDiscordId,
        },
        include: {
          trackers: true,
        },
      });

      if (!user) {
        return {
          error: `You are not registered yet, please enter \`/register\` to register your discord account.`,
        };
      }

      const tracker = user.trackers.find(
        (tracker) => tracker.gitlabUsername === toUnwatch,
      );

      if (!tracker) {
        return {
          error: `You are not watching Gitlab user ${toUnwatch}`,
        };
      }

      await this.db.tracker.delete({
        where: {
          id: tracker.id,
        },
      });

      return {
        result: {
          message: `Successfully removed ${toUnwatch} from your Gitlab tracked users.`,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        error: `Could not watch user ${toUnwatch}`,
      };
    }
  }
}
