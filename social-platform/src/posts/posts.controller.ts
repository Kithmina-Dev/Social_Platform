import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new post',
    description: 'Creates a new blog post with title and content. The post will be automatically indexed for search.'
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Post created successfully',
    schema: {
      example: {
        status: true,
        path: '/posts',
        message: 'success',
        statusCode: 201,
        data: {
          id: 'cmdvz20of0000i89c32z3x1md',
          title: 'My First Post',
          content: 'This is the content of my first post.',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T17:45:12.685Z'
        },
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @UsePipes(new ValidationPipe())
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all posts',
    description: 'Retrieves all posts ordered by creation date (newest first)'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Posts retrieved successfully',
    schema: {
      example: {
        status: true,
        path: '/posts',
        message: 'success',
        statusCode: 200,
        data: [
          {
            id: 'cmdvz20of0000i89c32z3x1md',
            title: 'My First Post',
            content: 'This is the content of my first post.',
            createdAt: '2025-08-03T17:45:12.685Z',
            updatedAt: '2025-08-03T17:45:12.685Z'
          }
        ],
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search posts',
    description: 'Search posts using Typesense full-text search. Searches in title and content fields.'
  })
  @ApiQuery({ 
    name: 'q', 
    description: 'Search query string',
    example: 'javascript tutorial',
    required: true 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Search results retrieved successfully',
    schema: {
      example: {
        status: true,
        path: '/posts/search?q=javascript',
        message: 'success',
        statusCode: 200,
        data: [
          {
            id: 'cmdvz20of0000i89c32z3x1md',
            title: 'JavaScript Tutorial',
            content: 'Learn JavaScript fundamentals...',
            authorId: 1,
            createdAt: 1754243112,
            updatedAt: 1754243112
          }
        ],
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  search(@Query('q') query: string) {
    return this.postsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get post by ID',
    description: 'Retrieves a specific post by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: 'cmdvz20of0000i89c32z3x1md'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Post retrieved successfully',
    schema: {
      example: {
        status: true,
        path: '/posts/cmdvz20of0000i89c32z3x1md',
        message: 'success',
        statusCode: 200,
        data: {
          id: 'cmdvz20of0000i89c32z3x1md',
          title: 'My First Post',
          content: 'This is the content of my first post.',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T17:45:12.685Z'
        },
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update post',
    description: 'Updates an existing post. Updated post will be re-indexed for search.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: 'cmdvz20of0000i89c32z3x1md'
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Post updated successfully',
    schema: {
      example: {
        status: true,
        path: '/posts/cmdvz20of0000i89c32z3x1md',
        message: 'success',
        statusCode: 200,
        data: {
          id: 'cmdvz20of0000i89c32z3x1md',
          title: 'Updated Post Title',
          content: 'Updated content of the post.',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T18:30:45.123Z'
        },
        timestamp: '2025-08-03 18:30:45'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete post',
    description: 'Deletes a post and removes it from the search index'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: 'cmdvz20of0000i89c32z3x1md'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Post deleted successfully',
    schema: {
      example: {
        status: true,
        path: '/posts/cmdvz20of0000i89c32z3x1md',
        message: 'success',
        statusCode: 200,
        data: {
          id: 'cmdvz20of0000i89c32z3x1md',
          title: 'Deleted Post',
          content: 'This post was deleted.',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T17:45:12.685Z'
        },
        timestamp: '2025-08-03 18:35:12'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
