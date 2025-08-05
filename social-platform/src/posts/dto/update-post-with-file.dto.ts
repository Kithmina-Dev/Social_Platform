import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePostDto } from './update-post.dto';

export class UpdatePostWithFileDto extends UpdatePostDto {
  @ApiProperty({
    description: 'The file to upload with the post update',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: any;
}
