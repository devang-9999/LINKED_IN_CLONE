import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from 'src/posts/entities/post.entity';
import { PostLike } from './entities/post-likes.entity';
import { CreatePostLikeDto } from './dto/post-like.dto';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async toggleLike(dto: CreatePostLikeDto) {
    const { postId, userId } = dto;

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        userId,
        post: { id: postId },
      },
      relations: ['post'],
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { message: 'Like removed' };
    }

    const like = this.likeRepository.create({
      userId,
      post,
      postId,
    });

    await this.likeRepository.save(like);

    return { message: 'Post liked' };
  }

  async getPostLikes(postId: string) {
    const likes = await this.likeRepository.find({
      where: { post: { id: postId } },
    });

    return {
      likesCount: likes.length,
    };
  }
}
