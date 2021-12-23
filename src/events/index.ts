import { EventsBus } from './bus';

const bus = new EventsBus();
bus.attachHandlers();

export default bus;
