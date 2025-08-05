import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Ensure uploads directory exists
    const uploadDir = this.configService.get<string>('files.uploadDir') || join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, user: User, postId?: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file size
    const maxFileSize = this.configService.get<number>('files.maxFileSize') || 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      throw new BadRequestException(`File size exceeds the limit of ${maxFileSize / 1024 / 1024}MB`);
    }

    // Validate file type
    const allowedMimeTypes = this.configService.get<string[]>('files.allowedMimeTypes') || 
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
    const filePath = join('uploads', uniqueFilename);

    // Save file info to database
    const fileRecord = await this.prisma.file.create({
      data: {
        filename: file.originalname,
        path: filePath,
        mimetype: file.mimetype,
        size: file.size,
        userId: user.id,
        ...(postId && { postId }),
      },
    });

    return fileRecord;
  }

  async getFileById(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new BadRequestException(`File with ID ${id} not found`);
    }

    return file;
  }

  async deleteFile(id: string, userId: string) {
    // Check if file exists and belongs to user
    const file = await this.prisma.file.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!file) {
      throw new BadRequestException(`File with ID ${id} not found or doesn't belong to you`);
    }

    // Delete file from database
    await this.prisma.file.delete({
      where: { id },
    });

    return { success: true };
  }

  async getFilesByPostId(postId: string) {
    return this.prisma.file.findMany({
      where: { postId },
    });
  }
}
