import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService, TypesenseService } from '../common/services';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesService } from '../files/files.service';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private typesenseService: TypesenseService,
    private filesService: FilesService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: string,
    file?: Express.Multer.File,
  ) {
    // Create the post using proper Prisma syntax
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: authorId,
      },
    });

    //console.log(`Post created with ID: ${post.id}`);

    // Upload file if provided
    if (file) {
      console.log('File upload details:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        destination: file.destination || 'unknown',
        path: file.path || 'unknown',
        postId: post.id,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: authorId },
      });

      if (user) {
        const fileRecord = await this.filesService.uploadFile(
          file,
          user,
          post.id,
        );
        console.log('File uploaded successfully:', fileRecord);
      } else {
        console.error(`User with ID ${authorId} not found for file upload`);
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

    // Return post with associated files - await to make sure files are included
    const postWithDetails = await this.getPostWithDetails(post.id);
    return postWithDetails;
  }

  async findAll(currentUserId?: string) {
    const filter = {
      where: currentUserId ? { authorId: currentUserId } : {},
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
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
      ...(currentUserId ? {} : { take: 10 }),
    };

    const posts = await this.prisma.post.findMany(filter);

    // For each post, get the like count
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCountResult: any[] = await this.prisma.$queryRaw`
          SELECT COUNT(*) as "likeCount" 
          FROM "PostLike" 
          WHERE "postId" = ${post.id}
        `;
        const likeCount = parseInt(
          String(likeCountResult[0]?.likeCount || '0'),
        );

        return {
          ...post,
          likes: likeCount,
        };
      }),
    );

    return postsWithLikes;
  }

  async getPostsByUsername(username: string) {
    // First find the user by username
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    // Then find all posts by this user
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
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

    // For each post, get the like count
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCountResult: any[] = await this.prisma.$queryRaw`
          SELECT COUNT(*) as "likeCount" 
          FROM "PostLike" 
          WHERE "postId" = ${post.id}
        `;
        const likeCount = parseInt(
          String(likeCountResult[0]?.likeCount || '0'),
        );

        return {
          ...post,
          likes: likeCount,
        };
      }),
    );

    return postsWithLikes;
  }

  async findOne(id: string) {
    return this.getPostWithDetails(id);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
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
        throw new ForbiddenException(
          'You are not authorized to update this post',
        );
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
        throw new ForbiddenException(
          'You are not authorized to delete this post',
        );
      }
    }

    const post = await this.prisma.post.delete({
      where: { id },
    });

    // Remove from Typesense with error handling
    try {
      await this.typesenseService.deletePost(id);
    } catch (error) {
      // Log the error but don't fail the deletion process
      console.error(`Error deleting post from Typesense: ${error.message}`);
      // Continue with the deletion process even if Typesense fails
    }

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

  async uploadImage(
    postId: string | null,
    file: Express.Multer.File,
    userId: string,
  ) {
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
          throw new ForbiddenException(
            'You are not authorized to add files to this post',
          );
        }
      }
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Convert null to undefined for compatibility with FilesService
    const fileRecord = await this.filesService.uploadFile(
      file,
      user,
      postId || undefined,
    );
    return fileRecord;
  }

  async likePost(postId: string, userId: string) {
    // First, check if the post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    try {
      // Use raw queries as a fallback when Prisma client is not generated
      // Check if the user has already liked this post
      const existingLikes: any[] = await this.prisma.$queryRaw`
        SELECT * FROM "PostLike" 
        WHERE "postId" = ${postId} AND "userId" = ${userId}
      `;

      if (existingLikes && existingLikes.length > 0) {
        const existingLike = existingLikes[0];

        // User has already liked this post, so unlike it
        await this.prisma.$executeRaw`
          DELETE FROM "PostLike" 
          WHERE "id" = ${existingLike.id}
        `;

        // Count likes for the post
        const likesResult: any[] = await this.prisma.$queryRaw`
          SELECT COUNT(*) as "likeCount" 
          FROM "PostLike" 
          WHERE "postId" = ${postId}
        `;

        const likeCount = parseInt(String(likesResult[0]?.likeCount || '0'));

        return {
          liked: false,
          likeCount,
          message: 'Post unliked successfully',
        };
      }

      // User hasn't liked this post yet, create a like
      const uuid = await this.generateUuid();
      await this.prisma.$executeRaw`
        INSERT INTO "PostLike" ("id", "postId", "userId", "createdAt")
        VALUES (${uuid}, ${postId}, ${userId}, NOW())
      `;

      // Count likes for the post
      const likesResult: any[] = await this.prisma.$queryRaw`
        SELECT COUNT(*) as "likeCount" 
        FROM "PostLike" 
        WHERE "postId" = ${postId}
      `;

      const likeCount = parseInt(String(likesResult[0]?.likeCount || '0'));

      return {
        liked: true,
        likeCount,
        message: 'Post liked successfully',
      };
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw new Error('Failed to toggle post like status');
    }
  }

  async isLikedByUser(postId: string, userId: string) {
    if (!userId) {
      return false;
    }

    try {
      const likes: any[] = await this.prisma.$queryRaw`
        SELECT * FROM "PostLike" 
        WHERE "postId" = ${postId} AND "userId" = ${userId}
      `;

      return likes && likes.length > 0;
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      return false;
    }
  }

  // Helper to generate UUID for our raw queries
  private async generateUuid(): Promise<string> {
    const result: any[] = await this.prisma
      .$queryRaw`SELECT gen_random_uuid() as uuid`;
    return result[0]?.uuid || crypto.randomUUID();
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

    // Get like count using raw query
    const likeCountResult: any[] = await this.prisma.$queryRaw`
      SELECT COUNT(*) as "likeCount" 
      FROM "PostLike" 
      WHERE "postId" = ${id}
    `;
    const likeCount = parseInt(String(likeCountResult[0]?.likeCount || '0'));

    // Create a modified post object with like count
    const postWithDetails = {
      ...post,
      likes: likeCount,
    };

    return postWithDetails;
  }
}
