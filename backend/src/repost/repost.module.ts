import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Repost } from './entities/repost.entity';
import { Post } from 'src/posts/entities/post.entity';
import { RepostsController } from './repost.controller';
import { RepostsService } from './repost.service';

@Module({
  imports: [TypeOrmModule.forFeature([Repost, Post])],
  controllers: [RepostsController],
  providers: [RepostsService],
  exports: [RepostsService],
})
export class RepostsModule {}
