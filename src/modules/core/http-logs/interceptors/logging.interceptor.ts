import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpLoggerService } from '../http-logger.service';
import { HttpLogEntity } from '../entities/http-log.entity';
import { RequestLogType } from '../enums/request-log-type.enum';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly httpLoggerService: HttpLoggerService,
    private readonly logger: Logger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { method, url, headers, body } = request;

    const startTime = Date.now();
    let logData: HttpLogEntity = null;
    try {
      logData = await this.httpLoggerService.logRequest({
        url,
        requestHeaders: headers,
        method,
        data: body,
        requestType: RequestLogType.INTERNAL,
      });
    } catch (e) {
      console.error(
        'Failed to log the api request in db',
        LoggingInterceptor.name,
      );
      throw e;
    }

    return next.handle().pipe(
      tap(async (data) => {
        const responseTime = Date.now() - startTime;
        const referenceId = request.logReferenceId;
        try {
          await this.httpLoggerService.logResponse(
            logData,
            {
              headers: response.getHeaders(),
              status: response.statusCode,
              data: data,
            },
            responseTime,
            referenceId,
          );
        } catch (e) {
          console.error(
            'Failed to log the api response in db',
            LoggingInterceptor.name,
          );
        }
      }),
      catchError(async (error) => {
        // Your error logging logic here...
        const responseTime = Date.now() - startTime;
        const referenceId = request.logReferenceId;
        try {
          await this.httpLoggerService.logResponse(
            logData,
            {
              headers: response.getHeaders(),
              status: error.status,
              data: error,
            },
            responseTime,
            referenceId,
          );
        } catch (e) {
          console.error(
            'Failed to log the api response in db',
            LoggingInterceptor.name,
          );
          throw e;
        }

        // Ensure the error continues to propagate after logging
        throw error;
      }),
    );
  }
}
