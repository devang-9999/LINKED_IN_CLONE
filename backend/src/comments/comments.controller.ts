import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // CREATE COMMENT / REPLY
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  // GET COMMENTS BY POST (WITH PAGINATION)
  @Get(':postId')
  getComments(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 2,
  ) {
    return this.commentsService.getCommentsByPost(
      postId,
      Number(page),
      Number(limit),
    );
  }

  // GET REPLIES WITH PAGINATION
  @Get('replies/:commentId')
  getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 2,
  ) {
    return this.commentsService.getReplies(
      commentId,
      Number(page),
      Number(limit),
    );
  }

  // DELETE COMMENT
  @Delete(':commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }
}
