import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatusCodesList } from '../constants/status-codes-list.constants';

interface Response<T> {
  success: boolean;
  code: number;
  data?: T;
  error?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Capture the actual response status code
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK; // Fallback to HttpStatus.OK if not available

    return next.handle().pipe(
      map((data) => {
        // Assume 'data' has a 'message' property if it's an object; otherwise, use a default message
        const message =
          data && typeof data === 'object' && data.message
            ? data.message
            : 'success';

        return {
          success: true,
          message,
          code: StatusCodesList.Success,
          statusCode, // Use the actual status code
          data:
            data && typeof data === 'object' && data.message
              ? { ...data, message: undefined }
              : data, // Remove 'message' from 'data' if it exists
        };
      }),
      catchError((error) => {
        console.log(error);
        let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unknown error';
        let errors = 'Unknown error';

        // Check if error.response exists and extract relevant information
        if (error.response) {
          message =
            error?.message ||
            error?.response?.message ||
            'Error without message';
          errors = error?.response?.error || error?.response?.errors;
          statusCode = statusCode || error?.response?.statusCode;
        } else {
          // Fallback to error.message if error.response is not available
          message = error.message || message;
        }

        // Format the error response
        const errorResponse = {
          success: false,
          message,
          statusCode,
          errors, // Optionally include additional error details here
        };

        // Log the error or perform additional actions if necessary

        // Use the response object directly to set the status code and send the error response
        response.status(statusCode).json(errorResponse);

        // It's important to return a throwError to terminate the request-response cycle properly
        return throwError(() => errorResponse);
      }),
    );
  }
}
