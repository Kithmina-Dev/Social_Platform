import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilesService } from './files.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        postId: {
          type: 'string',
          nullable: true,
          description: 'Optional post ID to associate with the file',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or file size/type' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = join(process.cwd(), 'uploads');
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException(`File type ${file.mimetype} is not allowed`), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const postId = req.body?.postId;
    return this.filesService.uploadFile(file, req.user, postId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'Return file information' })
  @ApiResponse({ status: 404, description: 'File not found' })
  getFile(@Param('id') id: string) {
    return this.filesService.getFileById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete file by ID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file ID or unauthorized' })
  deleteFile(@Param('id') id: string, @Req() req: any) {
    return this.filesService.deleteFile(id, req.user.id);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all files for a post' })
  @ApiResponse({ status: 200, description: 'Return files for post' })
  getFilesByPost(@Param('postId') postId: string) {
    return this.filesService.getFilesByPostId(postId);
  }
}
