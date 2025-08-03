import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TypesenseService } from '../typesense/typesense.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, TypesenseService],
})
export class PostsModule {}
