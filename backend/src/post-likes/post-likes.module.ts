/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from 'src/posts/entities/post.entity';

import { PostLikesService } from './post-likes.service';
import { PostLikesController } from './post-likes.controller';
import { PostLike } from './entities/post-likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, Post])],
  controllers: [PostLikesController],
  providers: [PostLikesService],
})
export class PostLikesModule {}