import { Injectable } from '@nestjs/common';

@Injectable()
export class MergeRequestValidationService {
  shouldHandle(body: any) {
    return body && body.object_kind === 'merge_request';
  }

  // @TODO make this standardized, using class validator or anything else
  validatePayload(body: any) {
    return body && body.object_attributes;
  }
}
