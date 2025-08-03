import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post. It can be a long text with multiple paragraphs.',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
