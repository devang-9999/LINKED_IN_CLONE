/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { CommentLikesService } from './comment-likes.service';
import { CommentLikesController } from './comment-likes.controller';
import { CommentLike } from './entities/comment-likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLike, Comment])],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
})
export class CommentLikesModule {}