import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

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
    });
  }
}
