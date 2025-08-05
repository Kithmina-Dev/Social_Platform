import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by username
    const user = await this.usersService.findByUsername(loginDto.username).catch(() => {
      throw new UnauthorizedException('Invalid username or password');
    });

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      username: user.username,
      role: user.role
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('auth.jwtSecret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
