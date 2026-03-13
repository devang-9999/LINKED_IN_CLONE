import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Repost } from './entities/repost.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class RepostsService {
  constructor(
    @InjectRepository(Repost)
    private readonly repostRepository: Repository<Repost>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // CREATE REPOST
  async create(userId: string, postId: string, message?: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Prevent self repost
    if (post.userId === userId) {
      throw new BadRequestException('You cannot repost your own post');
    }

    // Prevent duplicate repost
    const existingRepost = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    if (existingRepost) {
      throw new BadRequestException('You already reposted this post');
    }

    const repost = this.repostRepository.create({
      userId,
      postId,
      message,
    });

    return this.repostRepository.save(repost);
  }

  // GET ALL REPOSTS (for feed)
  async findAll() {
    return this.repostRepository.find({
      relations: ['user', 'post', 'post.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET REPOSTS OF A SPECIFIC POST
  async findByPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.repostRepository.find({
      where: { postId },
      relations: ['user', 'post', 'post.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // DELETE REPOST
  async remove(userId: string, postId: string) {
    const repost = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    if (!repost) {
      throw new NotFoundException('Repost not found');
    }

    await this.repostRepository.remove(repost);

    return { message: 'Repost removed successfully' };
  }

  // CHECK IF USER REPOSTED
  async hasUserReposted(userId: string, postId: string) {
    const repost = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    return !!repost;
  }
}
