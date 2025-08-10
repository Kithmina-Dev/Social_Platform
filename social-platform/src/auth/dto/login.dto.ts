import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Remember me flag',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
