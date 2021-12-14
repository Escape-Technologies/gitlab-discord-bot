import { AsyncLocalStorage } from 'async_hooks';
import { Message, User } from 'discord.js';

export interface MessageContext {
  message: Message;
  user: User;
}

export const MessageContextStore = new AsyncLocalStorage<MessageContext>();
