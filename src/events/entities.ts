export enum EventName {
  MR_OPENED = 'mr-opened',
  MR_UPDATED = 'mr-updated',
  MR_CLOSED = 'mr-closed'
}

export interface EventPayload<T = any> {
  data: T;
}

export type EventHandler = (payload: EventPayload) => Promise<void> | void;
