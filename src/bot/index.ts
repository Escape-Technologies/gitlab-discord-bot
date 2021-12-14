import { Client, Intents, MessageEmbed, TextChannel, User } from 'discord.js';
import { env } from '../utils/environment';
import { attachOnMessage } from './listeners/message';

export class GitlabBot {
  _bot: Client;
  user: User | null = null;
  mrChannel: TextChannel | null = null;

  constructor() {
    this._bot = new Client({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS
      ],
      partials: ['CHANNEL']
    });
    attachOnMessage(this._bot);
  }

  async start() {
    await this._bot.login(env.botToken);
    this.user = this._bot.user;
    this.mrChannel = (await this._bot.channels.fetch(
      env.mrsChannelId
    )) as TextChannel;
    console.log('succesfully logged in');
  }

  hello() {
    if (!this.user || !this.mrChannel) {
      throw new Error('bot is missing user or channel');
    }
    this.mrChannel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Hello `)
          .setColor('#409bd7')
          .setDescription(
            "I'll be managing this channel mostly, but **I can do a lot more !**\nFor more informations, you can **DM** me with the command `!help`.\n\nI'll be sending merge requests informations on this channel.\n\nI also offer **per-user features**, such as *notifications on comments or replies*, or *reviewal request notifications*.\nTo do so, I'll need you to just register your Gitlab username by sending me `!register <your username>`\n\n :warning: If you previously registered your username, I have been reset and I need you to register once again. :warning:"
          )
          .setThumbnail(this.user.displayAvatarURL())
          .setTimestamp()
      ]
    });
  }
}
