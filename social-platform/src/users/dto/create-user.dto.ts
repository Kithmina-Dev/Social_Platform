import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'User email address',
    example: 'kithmina@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Username for login',
    example: 'kithmina' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'User password (min 6 characters)',
    example: 'password123' 
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
