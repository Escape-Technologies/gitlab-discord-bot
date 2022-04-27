import { Injectable } from '@nestjs/common';
import { env } from 'app/libs/environment';
import { logger } from 'app/libs/logger';
import { CommandResult } from 'app/modules/discord/commands/entities';
import { DropCommandService } from 'app/modules/discord/commands/services/drop.service';
import { RegisterCommandService } from 'app/modules/discord/commands/services/register.service';
import { WatchCommandService } from 'app/modules/discord/commands/services/watch.service';
import {
  Client,
  Guild,
  Intents,
  Message,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { UnregisterCommandService } from './commands/services/unregister.service';

@Injectable()
export class DiscordService extends Client {
  mrChannel?: TextChannel;
  guild?: Guild;

  constructor(
    private readonly dropCommand: DropCommandService,
    private readonly registerCommand: RegisterCommandService,
    private readonly watchCommand: WatchCommandService,
    private readonly unregisterCommand: UnregisterCommandService,
  ) {
    super({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
      partials: ['CHANNEL'],
    });

    this.on('messageCreate', this.handleMessage);
  }

  async start() {
    await this.login(env.botToken);
    this.mrChannel = (await this.channels.fetch(
      env.mrsChannelId,
    )) as TextChannel;
    this.guild = this.guilds.cache.get(this.mrChannel.guildId);
    await this.guild?.members.fetch();
    logger.success('Bot successfully logged in');
  }

  hello() {
    if (!this.user || !this.mrChannel) {
      throw new Error('bot is missing user or channel');
    }
    this.mrChannel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Hello`)
          .setColor('#409bd7')
          .setDescription(
            "I'll be managing this channel mostly, but **I can do a lot more !**\nFor more informations, you can **DM** me with the command `!help`.\n\nI'll be sending merge requests informations on this channel.\n\nI also offer **per-user features**, such as *notifications on comments or replies*, or *reviewal request notifications*.\nTo do so, I'll need you to just register your Gitlab username by sending me `/register <your username>`\n\n :warning: If you previously registered your username, I have been reset and I need you to register once again. :warning:",
          )
          .setThumbnail(this.user.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  }

  async handleMessage(message: Message) {
    if (message.author.id !== this.user?.id) {
      const command = message.content.split(' ')[0];

      let commandResult: CommandResult;
      if (command && command.startsWith('/')) {
        switch (command) {
          case '/register':
            commandResult = await this.registerCommand.register(message);
            break;
          case '/watch':
            commandResult = await this.watchCommand.watch(message);
            break;
          case '/drop':
            commandResult = await this.dropCommand.drop(message);
            break;
          case '/unregister':
            commandResult = await this.unregisterCommand.unregister(message);
            break;
          default:
            commandResult = {
              error: `\`${command}\` is an invalid command !`,
            };
        }
        const { result, error }: CommandResult = commandResult;

        if (error) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Oups !`)
                .setColor(0xff0000)
                .setDescription(error),
            ],
          });
        } else if (result) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`You're all set !`)
                .setColor(0x00c70f)
                .setDescription(result.message),
            ],
          });
        }
      }
    }
  }
}
