import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService, TypesenseService } from '../common/services';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesService } from '../files/files.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private typesenseService: TypesenseService,
    private filesService: FilesService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string, file?: Express.Multer.File) {
    // Create the post using proper Prisma syntax
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: authorId,
      },
    });

    // Upload file if provided
    if (file) {
      const user = await this.prisma.user.findUnique({ where: { id: authorId } });
      if (user) {
        await this.filesService.uploadFile(file, user, post.id);
      }
    }

    // Index the post in Typesense for search
    await this.typesenseService.indexPost({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: authorId,
      createdAt: Math.floor(post.createdAt.getTime() / 1000),
      updatedAt: Math.floor(post.updatedAt.getTime() / 1000),
    });

    // Return post with associated files
    return this.getPostWithDetails(post.id);
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        files: true,
      },
    });
  }

  async findOne(id: string) {
    return this.getPostWithDetails(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string, file?: Express.Multer.File) {
    // Check if post exists 
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author
    if (existingPost.authorId !== userId) {
      // If not author, check if admin
      const user = await this.prisma.user.findUnique({ 
        where: { id: userId },
      });
      
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not authorized to update this post');
      }
    }

    // Update the post
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
    
    // Upload file if provided
    if (file) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await this.filesService.uploadFile(file, user, post.id);
      }
    }

    // Update the post in Typesense
    await this.typesenseService.updatePost(id, {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: existingPost.authorId,
      createdAt: Math.floor(post.createdAt.getTime() / 1000),
      updatedAt: Math.floor(post.updatedAt.getTime() / 1000),
    });

    return this.getPostWithDetails(id);
  }

  async remove(id: string, userId: string) {
    // Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author
    if (existingPost.authorId !== userId) {
      // If not author, check if admin
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not authorized to delete this post');
      }
    }

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
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          files: true,
        },
      });
    }

    return searchResults;
  }

  async uploadImage(postId: string | null, file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    // Check if post exists and user is author
    if (postId) {
      const existingPost = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!existingPost) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      // Check if user is the author
      if (existingPost.authorId !== userId) {
        // If not author, check if admin
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        
        if (!user || user.role !== 'ADMIN') {
          throw new ForbiddenException('You are not authorized to add files to this post');
        }
      }
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Convert null to undefined for compatibility with FilesService
    const fileRecord = await this.filesService.uploadFile(file, user, postId || undefined);
    return fileRecord;
  }

  private async getPostWithDetails(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
        files: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
