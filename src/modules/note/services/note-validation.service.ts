import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteValidationService {
  shouldHandle(body: any) {
    return body && body.object_kind === 'notes';
  }

  // @TODO make this standardized, using class validator or anything else
  validatePayload(body: any) {
    return body && body.object_attributes;
  }
}
