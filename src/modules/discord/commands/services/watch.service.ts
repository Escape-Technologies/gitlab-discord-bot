import { Injectable } from '@nestjs/common';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { CommandResult } from 'app/modules/discord/commands/entities';
import { Message } from 'discord.js';

@Injectable()
export class WatchCommandService {
  constructor(private readonly db: DatabaseClient) {}

  async watch(message: Message): Promise<CommandResult> {
    const authorDiscordId = message.author.id;
    const toWatch = message.content.split(' ')[1];

    if (!toWatch) {
      return {
        error: `Invalid username provided.`,
      };
    }

    logger.log(`Running watch command with gitlab user ${toWatch}`);
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

      if (user.trackers.find((tracker) => tracker.gitlabUsername === toWatch)) {
        return {
          error: `You are already watching Gitlab user ${toWatch}`,
        };
      }

      await this.db.tracker.create({
        data: {
          userId: user.id,
          gitlabUsername: toWatch,
        },
      });

      return {
        result: {
          message: `Successfully added ${toWatch} to your Gitlab tracked users.`,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        error: `Could not watch user ${toWatch}`,
      };
    }
  }
}
