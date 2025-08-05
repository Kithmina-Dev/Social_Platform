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
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
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
import { UploadPostImageDto } from './dto/upload-post-image.dto';
import { CreatePostWithFileDto } from './dto/create-post-with-file.dto';
import { UpdatePostWithFileDto } from './dto/update-post-with-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    }
  }))
  @ApiOperation({ 
    summary: 'Create a new post',
    description: 'Creates a new blog post with title and content. The post will be automatically indexed for search. Optionally upload a file with the post.'
  })
  @ApiBody({ type: CreatePostWithFileDto })
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
          authorId: 'clz1w3j4k0001i8jhhst1x0zx',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T17:45:12.685Z',
          author: {
            id: 'clz1w3j4k0001i8jhhst1x0zx',
            username: 'johndoe',
            email: 'john@example.com',
            createdAt: '2025-08-03T16:45:12.685Z',
          },
          files: []
        },
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe())
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    return this.postsService.create(createPostDto, req.user.id, file);
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

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    }
  }))
  @ApiOperation({ 
    summary: 'Upload an image',
    description: 'Uploads an image and optionally attaches it to a post'
  })
  @ApiBody({ type: UploadPostImageDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'File uploaded successfully',
    schema: {
      example: {
        status: true,
        path: '/posts/upload',
        message: 'success',
        statusCode: 201,
        data: {
          id: 'cmdvz20of0000i89c32z3x1ff',
          filename: 'my-image.jpg',
          path: 'uploads/uuid-filename.jpg',
          mimetype: 'image/jpeg',
          size: 12345,
          postId: 'cmdvz20of0000i89c32z3x1md',
          userId: 'clz1w3j4k0001i8jhhst1x0zx',
          isProfilePic: false,
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T17:45:12.685Z'
        },
        timestamp: '2025-08-03 17:45:12'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file or missing file' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  uploadImage(
    @Body() uploadDto: UploadPostImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    return this.postsService.uploadImage(uploadDto.postId || null, file, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    }
  }))
  @ApiOperation({ 
    summary: 'Update post',
    description: 'Updates an existing post. Updated post will be re-indexed for search.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: 'cmdvz20of0000i89c32z3x1md'
  })
  @ApiBody({ type: UpdatePostWithFileDto })
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
          authorId: 'clz1w3j4k0001i8jhhst1x0zx',
          createdAt: '2025-08-03T17:45:12.685Z',
          updatedAt: '2025-08-03T18:30:45.123Z',
          author: {
            id: 'clz1w3j4k0001i8jhhst1x0zx',
            username: 'johndoe',
            email: 'john@example.com',
            createdAt: '2025-08-03T16:45:12.685Z',
          },
          files: []
        },
        timestamp: '2025-08-03 18:30:45'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - not post owner or admin' })
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - not post owner or admin' })
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.remove(id, req.user.id);
  }
}
