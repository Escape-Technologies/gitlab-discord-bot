import bus from '../../events';
import { EventName } from '../../events/entities';
import logger from '../../utils/logger';
import { MrClosedWebhookPayload } from '../dtos/mr-closed.interface';
import { MrOpenedWebhookPayload } from '../dtos/mr-opened.interface';
import { MrUpdateWebhookPayload } from '../dtos/mr-updated.interface';
import { WebhookRequest } from '../server';

function shouldHandle(req: WebhookRequest) {
  const kind: string = req.body.object_kind;
  if (!kind) {
    return false;
  }
  return kind === 'merge_request';
}

// @TODO make this standardized, using class validator or anything else
function validatePayload(req: WebhookRequest) {
  const { object_attributes } = req.body;
  return object_attributes;
}

function handleMR(req: WebhookRequest) {
  const { object_attributes } = req.body;
  const { action } = object_attributes;
  logger.info(`Received mr event with action ${action}`);

  if (action === 'open' || action === 'reopen') {
    const body = req.body as MrOpenedWebhookPayload;
    logger.info(`Emitting event "${EventName.MR_OPENED}"`);
    bus.emit<MrOpenedWebhookPayload>(EventName.MR_OPENED, {
      data: body
    });
  }

  if (action === 'update') {
    const body = req.body as MrUpdateWebhookPayload;
    logger.info(`Emitting event "${EventName.MR_UPDATED}"`);
    bus.emit<MrUpdateWebhookPayload>(EventName.MR_UPDATED, {
      data: body
    });
  }

  if (action === 'close') {
    const body = req.body as MrClosedWebhookPayload;
    logger.info(`Emitting event "${EventName.MR_CLOSED}"`);
    bus.emit<MrClosedWebhookPayload>(EventName.MR_CLOSED, {
      data: body
    });
  }
}

const mrMiddleware = (req: WebhookRequest) => {
  if (shouldHandle(req) && validatePayload(req)) {
    handleMR(req);
  }
};

export default mrMiddleware;
