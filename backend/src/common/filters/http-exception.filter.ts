import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from '../interfaces';

/**
 * Global HTTP exception filter.
 *
 * Catches every thrown exception (both HttpException and unexpected errors)
 * and normalises the response into the ApiError shape so the frontend always
 * receives a consistent error envelope.
 *
 * Validates: Requirement 26.4 — all error responses use the ApiError format.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let error: string;
    let message: string;
    let details: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        error = this.statusToErrorCode(statusCode);
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as Record<string, unknown>;

        // NestJS ValidationPipe produces { message: string[], error: string, statusCode }
        if (Array.isArray(body['message'])) {
          error = (body['error'] as string) ?? this.statusToErrorCode(statusCode);
          message = 'Validation failed';
          details = this.extractValidationDetails(body['message'] as string[]);
        } else {
          error = (body['error'] as string) ?? this.statusToErrorCode(statusCode);
          message = (body['message'] as string) ?? exception.message;
        }
      } else {
        error = this.statusToErrorCode(statusCode);
        message = exception.message;
      }
    } else {
      // Unexpected / unhandled error — return 500 and log it
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'INTERNAL_SERVER_ERROR';
      message = 'An unexpected error occurred. Please try again later.';
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiError = {
      statusCode,
      error,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  /**
   * Converts class-validator constraint messages (format "field.constraintName")
   * into a { field: [messages] } map for easy frontend consumption.
   */
  private extractValidationDetails(messages: string[]): Record<string, string[]> {
    const details: Record<string, string[]> = {};

    for (const msg of messages) {
      // class-validator decorates messages as "fieldName constraint message"
      // We split on the first space to derive the field name heuristically.
      // A more precise approach would use ValidationError objects directly,
      // which is handled by the custom ValidationPipe configuration below.
      const spaceIdx = msg.indexOf(' ');
      const field = spaceIdx === -1 ? 'value' : msg.substring(0, spaceIdx);
      const constraint = spaceIdx === -1 ? msg : msg.substring(spaceIdx + 1);

      if (!details[field]) {
        details[field] = [];
      }
      details[field].push(constraint);
    }

    return details;
  }

  private statusToErrorCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      405: 'METHOD_NOT_ALLOWED',
      408: 'REQUEST_TIMEOUT',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return map[status] ?? 'HTTP_ERROR';
  }
}
