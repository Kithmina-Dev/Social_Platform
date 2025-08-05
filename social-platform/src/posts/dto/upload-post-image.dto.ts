import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadPostImageDto {
  @ApiProperty({
    description: 'The ID of the post to attach the image to',
    example: 'cmdvz20of0000i89c32z3x1md',
    required: false,
  })
  @IsString()
  @IsOptional()
  postId?: string;
}
