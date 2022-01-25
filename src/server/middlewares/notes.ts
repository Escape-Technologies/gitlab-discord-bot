import logger from '../../utils/logger';
import { WebhookRequest } from '../server';

function shouldHandle(req: WebhookRequest) {
  const kind: string = req.body.object_kind;
  if (!kind) {
    return false;
  }
  return kind === 'note';
}

// @TODO make this standardized, using class validator or anything else
function validatePayload(req: WebhookRequest) {
  const { object_attributes } = req.body;
  return object_attributes;
}

function handleNote(req: WebhookRequest) {
  const { object_attributes } = req.body;
  logger.info(`Received note event`);

  console.log('here', Object.keys(object_attributes));
}

const notesMiddleware = (
  req: WebhookRequest,
  _res: Express.Response,
  next: CallableFunction
) => {
  console.log('here');
  if (shouldHandle(req) && validatePayload(req)) {
    handleNote(req);
  }
  next();
};

console.log();

export default notesMiddleware;
