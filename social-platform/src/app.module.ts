import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { appConfig, databaseConfig, typesenseConfig, authConfig, fileConfig } from './config';
import { ServicesModule } from './common/services';
import { CoreModule } from './common/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, typesenseConfig, authConfig, fileConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    ServicesModule,
    PostsModule,
    UsersModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
