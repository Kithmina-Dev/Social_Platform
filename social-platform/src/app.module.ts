import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { appConfig, databaseConfig, typesenseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, typesenseConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
