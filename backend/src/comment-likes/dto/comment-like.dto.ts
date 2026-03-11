import { IsUUID } from 'class-validator';

export class CreateCommentLikeDto {
  @IsUUID()
  commentId: string;

  @IsUUID()
  userId: string;
}
