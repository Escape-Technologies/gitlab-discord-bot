import { MessageContextStore } from '../context';
import { register } from './register';

export interface CommandResult {
  result?: { message: string; data?: any };
  error?: string;
}

export async function handleCommandMessage(
  command: string
): Promise<CommandResult> {
  const context = MessageContextStore.getStore();
  if (!context) {
    return {
      error: 'Invalid invokation'
    };
  }
  switch (command) {
    case '/register':
      const [_command, gitlabId, ..._content] =
        context.message.content.split(' ');
      return await register(context.user.id, gitlabId);
    default:
      return {
        error: `\`${command}\` is an invalid command !`
      };
  }
}
