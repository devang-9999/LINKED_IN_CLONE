import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
