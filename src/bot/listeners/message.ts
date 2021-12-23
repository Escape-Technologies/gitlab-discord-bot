import { Message, MessageEmbed } from 'discord.js';
import bot from '..';
import { handleCommandMessage } from '../commands/broker';
import { CommandResult } from '../commands/entities';

export async function handleMessage(message: Message) {
  if (message.author.id !== bot.user?.id) {
    const [command, ..._] = message.content.split(' ');

    if (command && command.startsWith('/')) {
      const { result, error }: CommandResult = await handleCommandMessage(
        command
      );

      if (error) {
        message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Oups !`)
              .setColor(0xff0000)
              .setDescription(error)
          ]
        });
      } else if (result) {
        message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`You're all set !`)
              .setColor(0x00c70f)
              .setDescription(result.message)
          ]
        });
      }
    }
  }
}
