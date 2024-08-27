import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LogReferenceId = createParamDecorator(
  (
    data: { key: string; location: 'body' | 'headers' | 'params' | 'query' },
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();

    const logReferenceId = request[data.location][data.key];
    request.logReferenceId = logReferenceId;
    return logReferenceId; // This returns the value to the route handler if needed
  },
);
