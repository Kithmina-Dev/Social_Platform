import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Simple health check endpoint to verify the API is running'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'API is running successfully',
    schema: {
      example: {
        status: true,
        path: '/',
        message: 'success',
        statusCode: 200,
        data: 'Hello World!',
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
