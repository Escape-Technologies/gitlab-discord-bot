import { MessageContextStore } from '../context';
import { CommandResult } from './entities';
import { register } from './register';
import { unregister } from './unregister';

export async function handleCommandMessage(
  command: string
): Promise<CommandResult> {
  const context = MessageContextStore.getStore();
  if (!context) {
    return {
      error: 'Invalid invokation'
    };
  }
  const [_command, gitlabId, ..._content] = context.message.content.split(' ');
  switch (command) {
    case '/register':
      return await register(context.user.id, gitlabId);
    case '/unregister':
      return await unregister(context.user.id, gitlabId);
    default:
      return {
        error: `\`${command}\` is an invalid command !`
      };
  }
}
