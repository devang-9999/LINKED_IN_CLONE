import { IsUUID } from 'class-validator';

export class CreatePostLikeDto {
  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;
}
