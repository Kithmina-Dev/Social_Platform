import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the application
 * This centralizes all Swagger configuration in one place
 * @param app The NestJS application instance
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Social Platform API')
    .setVersion('1.0')
    .addTag('posts', 'Post management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('app', 'Application endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Social Platform API Documentation',
    customfavIcon: '/favicon.ico',
    customCssUrl: '',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  });
}
