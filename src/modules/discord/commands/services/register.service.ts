import { Injectable } from '@nestjs/common';
import { logger } from 'app/libs/logger';
import { DatabaseClient } from 'app/modules/database/database.service';
import { CommandResult } from 'app/modules/discord/commands/entities';
import { Message } from 'discord.js';

@Injectable()
export class RegisterCommandService {
  constructor(private readonly db: DatabaseClient) {}

  async register(message: Message): Promise<CommandResult> {
    const discordUserId = message.author.id;
    logger.log(`Running register command with discord user ${discordUserId}}`);

    const gitlabUsername = message.content.split(' ')[1];

    if (!gitlabUsername) {
      return {
        error: `Invalid Gitlab username provided.`,
      };
    }

    try {
      const user = await this.db.user.findUnique({
        where: {
          discordId: discordUserId,
        },
      });

      if (user) {
        return {
          error: `You are already registered`,
        };
      }
    } catch (e) {
      logger.error(e);
      return {
        error: `Could not fetch user ${discordUserId}`,
      };
    }

    try {
      const user = await this.db.user.create({
        data: {
          discordId: discordUserId,
          gitlabUsername,
          trackers: {
            create: [
              {
                gitlabUsername,
              },
            ],
          },
        },
      });
      return {
        result: {
          message: `Succesfully registered \`{ discordId: ${discordUserId}, userId: ${user.id} }}\``,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        error: `Registration failed`,
      };
    }
  }
}
