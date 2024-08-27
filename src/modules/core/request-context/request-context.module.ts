import { Module, Scope, Request } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { REQUEST } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: RequestContextService,
      useFactory: (request: Request) => new RequestContextService(request),
      scope: Scope.REQUEST,
      inject: [REQUEST],
    },
  ],
  exports: [RequestContextService],
})
export class RequestContextModule {}
