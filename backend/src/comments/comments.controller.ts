/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get(':postId')
  getComments(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(postId);
  }

  @Delete(':commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }
}