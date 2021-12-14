import { Client, MessageEmbed } from 'discord.js';
import { CommandResult, handleCommandMessage } from '../commands';
import { MessageContextStore } from '../context';

export function attachOnMessage(bot: Client) {
  bot.on('messageCreate', async (message) => {
    if (message.author.id !== bot.user?.id) {
      const [command, ..._] = message.content.split(' ');

      if (command && command.startsWith('/')) {
        const { result, error }: CommandResult = await new Promise(
          (resolve) => {
            MessageContextStore.run(
              { message, user: message.author },
              async () => {
                const returned = await handleCommandMessage(command);
                resolve(returned);
              }
            );
          }
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
  });
}
