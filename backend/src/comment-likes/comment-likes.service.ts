import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from 'src/comments/entities/comment.entity';
import { CommentLike } from './entities/comment-likes.entity';
import { CreateCommentLikeDto } from './dto/comment-like.dto';

@Injectable()
export class CommentLikesService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly likeRepository: Repository<CommentLike>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async toggleLike(dto: CreateCommentLikeDto) {
    const { commentId, userId } = dto;

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        userId,
        comment: { id: commentId },
      },
      relations: ['comment'],
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { message: 'Like removed' };
    }

    const like = this.likeRepository.create({
      userId,
      commentId,
      comment,
    });

    await this.likeRepository.save(like);

    return { message: 'Comment liked' };
  }

  async getCommentLikes(commentId: string) {
    const likes = await this.likeRepository.find({
      where: { comment: { id: commentId } },
    });

    return {
      likesCount: likes.length,
    };
  }
}
