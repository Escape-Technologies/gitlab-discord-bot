import { EventHandler, EventName } from '../entities';
import mrOpenedHandler from './mr-opened';
import mrUpdatedHandler from './mr-updated';

const handlers = new Map<EventName, EventHandler>();
handlers.set(EventName.MR_OPENED, mrOpenedHandler);
handlers.set(EventName.MR_UPDATED, mrUpdatedHandler);

export default handlers;
