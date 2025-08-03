import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TypesenseService } from '../typesense/typesense.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private typesenseService: TypesenseService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });

    // Index the post in Typesense for search
    await this.typesenseService.indexPost({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: 1, // Default author ID for now
      createdAt: Math.floor(post.createdAt.getTime() / 1000), // Convert to Unix timestamp
      updatedAt: Math.floor(post.updatedAt.getTime() / 1000),
    });

    return post;
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });

    // Update the post in Typesense
    await this.typesenseService.updatePost(id, {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: 1, // Default author ID for now
      createdAt: Math.floor(post.createdAt.getTime() / 1000),
      updatedAt: Math.floor(post.updatedAt.getTime() / 1000),
    });

    return post;
  }

  async remove(id: string) {
    const post = await this.prisma.post.delete({
      where: { id },
    });

    // Remove from Typesense
    await this.typesenseService.deletePost(id);

    return post;
  }

  async search(query: string) {
    // Use Typesense for search
    const searchResults = await this.typesenseService.searchPosts(query);
    
    // If no results from Typesense or empty query, fallback to Prisma
    if (!query || searchResults.length === 0) {
      return this.prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              content: {
                contains: query,
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return searchResults;
  }
}
