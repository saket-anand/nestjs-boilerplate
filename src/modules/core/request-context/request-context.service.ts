import { Injectable, Scope, Request } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private _correlationId: string | null = null;

  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  getCorrelationId(): string {
    if (!this._correlationId) {
      this._correlationId =
        (this.request.headers['x-correlation-id'] as string) || uuid();
      this.request.headers['x-correlation-id'] = this._correlationId;
    }
    // // Check if the x-correlation-id header exists
    // if (!this.request.headers['x-correlation-id']) {
    //   // If not, generate a new UUID and set it as the x-correlation-id header
    //   this.request.headers['x-correlation-id'] = uuid();
    // }
    return this._correlationId;
  }
}
