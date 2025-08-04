import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// This filter handles HTTP exceptions and Prisma errors globally
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Get detailed information about the exception
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const error = this.getError(exception);

    // Log the error with context
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    // Return a standardized error response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    
    // Handle Prisma specific errors
    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        return HttpStatus.NOT_FOUND;
      }
      if (exception.code === 'P2002') {
        return HttpStatus.CONFLICT;
      }
    }
    
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: any): string {
    // For HTTP exceptions, use the response message
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && 'message' in response) {
        return Array.isArray(response.message)
          ? response.message[0]
          : response.message as string;
      }
      return exception.message;
    }
    
    // For Prisma errors, provide user-friendly messages
    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        return 'The requested resource was not found.';
      }
      if (exception.code === 'P2002') {
        const field = exception.meta?.target as string[];
        return `A resource with this ${field?.[0] || 'value'} already exists.`;
      }
    }
    
    return exception.message || 'Internal server error';
  }

  private getError(exception: any): string {
    if (exception instanceof HttpException) {
      return exception.name;
    }
    
    if (exception instanceof PrismaClientKnownRequestError) {
      return `Database error: ${exception.code}`;
    }
    
    return exception.name || 'InternalServerError';
  }
}
