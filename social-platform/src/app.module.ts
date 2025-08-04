import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { appConfig, databaseConfig, typesenseConfig } from './config';
import { ServicesModule } from './common/services';
import { CoreModule } from './common/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, typesenseConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    ServicesModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
