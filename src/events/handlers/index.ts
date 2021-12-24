import { EventHandler, EventName } from '../entities';
import mrOpenedHandler from './mr-opened';
import mrUpdatedHandler from './mr-updated';
import mrClosedHandler from './mr-closed';

const handlers = new Map<EventName, EventHandler>();
handlers.set(EventName.MR_OPENED, mrOpenedHandler);
handlers.set(EventName.MR_UPDATED, mrUpdatedHandler);
handlers.set(EventName.MR_CLOSED, mrClosedHandler);

export default handlers;
