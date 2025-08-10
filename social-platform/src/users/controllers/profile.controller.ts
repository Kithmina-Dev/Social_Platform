import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../users.service';
import { FilesService } from '../../files/files.service';
import { UpdateUserDto } from '../dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('profile')
@Controller('users/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getProfile(@Request() req) {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new BadRequestException('User ID not found in token payload');
      }
      const user = await this.usersService.findOne(userId);

      // Get profile picture if exists
      const profilePic = await this.filesService.getUserProfilePicture(userId);
      const avatar = profilePic ? `/${profilePic.path}` : null;

      return {
        ...user,
        avatar,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user',
    example: 'johndoe',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfileByUsername(@Param('username') username: string) {
    try {
      // Find user by username without throwing error directly
      const user = await this.usersService.findByUsernameWithoutError(username);

      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }

      // Get profile picture if exists
      const profilePic = await this.filesService.getUserProfilePicture(user.id);
      const avatar = profilePic ? `/${profilePic.path}` : null;

      // Get follower and following counts
      const followersCount = await this.usersService.countFollowers(user.id);
      const followingCount = await this.usersService.countFollowing(user.id);
      const postsCount = await this.usersService.countUserPosts(user.id);

      return {
        ...user,
        avatar,
        followersCount,
        followingCount,
        postsCount,
      };
    } catch (error) {
      console.error(`Error fetching profile for username ${username}:`, error);
      throw error;
    }
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        displayName: { type: 'string' },
        bio: { type: 'string' },
        website: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);

        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `File type ${file.mimetype} is not allowed`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new BadRequestException('User ID not found in token payload');
      }

      console.log('Updating profile for user:', userId);
      console.log('Update profile DTO:', updateProfileDto);

      // Update user profile in database
      const updatedUser = await this.usersService.update(
        userId,
        updateProfileDto,
      );

      let avatarUrl: string | null = null;
      if (avatar) {
        // Mark old profile pictures as not the profile picture
        await this.filesService.resetUserProfilePictures(userId);

        // Save new profile picture
        const file = await this.filesService.uploadFile(avatar, req.user);
        await this.filesService.markAsProfilePicture(file.id);

        avatarUrl = `/uploads/${avatar.filename}`;
      } else {
        // Get existing profile picture if available
        const profilePic =
          await this.filesService.getUserProfilePicture(userId);
        if (profilePic) {
          avatarUrl = `/${profilePic.path}`;
        }
      }

      return {
        ...updatedUser,
        avatar: avatarUrl,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}
