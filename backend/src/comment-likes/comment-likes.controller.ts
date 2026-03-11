/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { CommentLikesService } from './comment-likes.service';
import { CreateCommentLikeDto } from './dto/comment-like.dto';

@Controller('comment-likes')
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @Post()
  toggleLike(@Body() dto: CreateCommentLikeDto) {
    return this.commentLikesService.toggleLike(dto);
  }

  @Get(':commentId')
  getLikes(@Param('commentId') commentId: string) {
    return this.commentLikesService.getCommentLikes(commentId);
  }
}