/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreateCommentDto) {
    const { text, postId, userId, parentCommentId } = dto;

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let parentComment: any;

    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.commentRepository.create({
      text,
      userId,
      postId,
      post,
      parentComment,
    });

    await this.commentRepository.save(comment);

    return {
      message: parentCommentId ? 'Reply added' : 'Comment added',
      commentId: comment.id,
    };
  }

  async getCommentsByPost(postId: string) {
    const comments = await this.commentRepository.find({
      where: {
        post: { id: postId },
        parentComment: IsNull(),
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];

    for (const comment of comments) {
      result.push({
        id: comment.id,
        text: comment.text,
        userId: comment.userId,
        createdAt: comment.createdAt,
        replies: await this.loadReplies(comment.id),
      });
    }

    return result;
  }

  private async loadReplies(commentId: string) {
    const replies = await this.commentRepository.find({
      where: {
        parentComment: { id: commentId },
        isDeleted: false,
      },
      order: { createdAt: 'ASC' },
    });

    const result: any[] = [];

    for (const reply of replies) {
      result.push({
        id: reply.id,
        text: reply.text,
        userId: reply.userId,
        createdAt: reply.createdAt,
        replies: await this.loadReplies(reply.id),
      });
    }

    return result;
  }

  async deleteComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.isDeleted = true;

    await this.commentRepository.save(comment);

    return { message: 'Comment deleted' };
  }
}
