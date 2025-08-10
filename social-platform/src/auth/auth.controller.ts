import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  login(@Body() loginDto: LoginDto) {
    console.log('Login attempt:', {
      username: loginDto.username,
      rememberMe: loginDto.rememberMe || false,
    });
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, returns access token and user info',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user already exists',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // Create the user
    const user = await this.usersService.create(createUserDto);

    // Log the user in
    return this.authService.login({
      username: createUserDto.username,
      password: createUserDto.password,
      rememberMe: true,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
      console.log('User ID from token:', userId);

      if (!userId) {
        throw new Error('User ID not found in token payload');
      }

      const user = await this.usersService.findOne(userId);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Default avatar
        avatar: null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}
