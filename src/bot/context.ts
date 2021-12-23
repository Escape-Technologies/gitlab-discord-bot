import { AsyncLocalStorage } from 'async_hooks';
import { Client, Message, User } from 'discord.js';

export interface MessageContext {
  message: Message;
  user: User;
  bot: Client;
}

export const MessageContextStore = new AsyncLocalStorage<MessageContext>();
