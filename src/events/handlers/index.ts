import { EventHandler, EventName } from '../entities';
import mrCreatedHandler from './mr-opened';

const handlers = new Map<EventName, EventHandler>();
handlers.set(EventName.MR_OPENED, mrCreatedHandler);

export default handlers;
