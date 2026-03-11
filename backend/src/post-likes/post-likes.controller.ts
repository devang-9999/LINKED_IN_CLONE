/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/post-like.dto';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  toggleLike(@Body() dto: CreatePostLikeDto) {
    return this.postLikesService.toggleLike(dto);
  }

  @Get(':postId')
  getLikes(@Param('postId') postId: string) {
    return this.postLikesService.getPostLikes(postId);
  }
}