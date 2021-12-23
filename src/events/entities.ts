export enum EventName {
  MR_OPENED = 'mr-opened',
  MR_UPDATED = 'mr-updated'
}

export interface EventPayload<T = any> {
  data: T;
}

export type EventHandler = (payload: EventPayload) => Promise<void> | void;

export interface MrCreatedEventPayload {
  mrId: number;
  projectId: number;
}
