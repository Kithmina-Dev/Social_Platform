import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //Setup Swagger
  setupSwagger(app);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:4000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available at: http://localhost:${port}/api/docs`);
  console.log(`If using Nuxt frontend, access it at: http://localhost:8000`);
}
bootstrap();
