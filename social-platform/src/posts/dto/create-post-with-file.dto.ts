import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class CreatePostWithFileDto extends CreatePostDto {
  @ApiProperty({
    description: 'The file to upload with the post',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: any;
}
