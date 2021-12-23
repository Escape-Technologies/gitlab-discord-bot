import EventEmitter from 'events';
import { EventHandler, EventName, EventPayload } from './entities';
import handlers from './handlers';

export class EventsBus {
  _emitter: EventEmitter;

  constructor() {
    this._emitter = new EventEmitter();
  }

  emit<T = any>(name: EventName, payload: EventPayload<T>) {
    this._emitter.emit(name, payload);
  }

  on(name: EventName, handler: EventHandler) {
    this._emitter.on(name, handler);
  }

  attachHandlers() {
    handlers.forEach((handler, key) => {
      this.on(key, handler);
    });
  }
}
