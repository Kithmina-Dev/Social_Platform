import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Social Platform API')
    .addTag('posts', 'Post management endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Social Platform API Documentation',
    customfavIcon: '/favicon.ico',
    customCssUrl: '',
  });
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:4000', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });
  
  await app.listen(process.env.PORT ?? 8000);
  
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 8000}`);
  console.log(`Swagger UI is available at: http://localhost:${process.env.PORT ?? 8000}/api/docs`);
}
bootstrap();
