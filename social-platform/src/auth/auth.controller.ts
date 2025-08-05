import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful, returns access token' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid credentials' 
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
