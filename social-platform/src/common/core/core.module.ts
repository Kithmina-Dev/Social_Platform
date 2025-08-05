import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

// Provides global application functionality such as error handling, logging, and response formattin
@Global()
@Module({
  providers: [
    // Global response interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // Global exception filter for consistent error handling
    {
      provide: APP_FILTER, 
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CoreModule {}
