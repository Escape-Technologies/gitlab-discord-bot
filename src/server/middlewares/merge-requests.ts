import bus from '../../events';
import { EventName } from '../../events/entities';
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
  const { project, object_attributes } = req.body;
  return object_attributes && project;
}

function handleMR(req: WebhookRequest) {
  const { project, object_attributes } = req.body;
  const { state, id } = object_attributes;
  console.log(`received mr event with status ${state}`);
  if (state === 'opened') {
    const data = { projectId: project.id, mrId: id };
    console.log(`emitting event "${EventName.MR_OPENED}" with payload`);
    console.log(data);
    bus.emit(EventName.MR_OPENED, {
      data
    });
  }
}

const mrMiddleware = (req: WebhookRequest) => {
  if (shouldHandle(req) && validatePayload(req)) {
    handleMR(req);
  }
};

export default mrMiddleware;
