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

  // CREATE COMMENT OR REPLY
  async create(dto: CreateCommentDto) {
    const { text, postId, userId, parentCommentId } = dto;

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let parentComment: Comment | null = null;

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
      parentComment: parentComment || undefined,
    });

    await this.commentRepository.save(comment);

    return {
      message: parentCommentId ? 'Reply added' : 'Comment added',
      commentId: comment.id,
    };
  }

  // GET COMMENTS WITH PAGINATION
  async getCommentsByPost(postId: string, page = 1, limit = 2) {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: {
        post: { id: postId },
        parentComment: IsNull(),
        isDeleted: false,
      },

      relations: ['user'],

      order: { createdAt: 'DESC' },

      skip,
      take: limit,
    });

    const result: any[] = [];

    for (const comment of comments) {
      result.push({
        id: comment.id,
        text: comment.text,
        user: comment.user,
        createdAt: comment.createdAt,
      });
    }

    return {
      comments: result,
      page,
      limit,
      total,
      hasMore: skip + comments.length < total,
    };
  }

  // GET REPLIES WITH PAGINATION
  async getReplies(commentId: string, page = 1, limit = 2) {
    const skip = (page - 1) * limit;

    const [replies, total] = await this.commentRepository.findAndCount({
      where: {
        parentComment: { id: commentId },
        isDeleted: false,
      },

      relations: ['user'],

      order: { createdAt: 'ASC' },

      skip,
      take: limit,
    });

    const result: any[] = [];

    for (const reply of replies) {
      result.push({
        id: reply.id,
        text: reply.text,
        user: reply.user,
        createdAt: reply.createdAt,
      });
    }

    return {
      replies: result,
      page,
      limit,
      total,
      hasMore: skip + replies.length < total,
    };
  }

  // DELETE COMMENT (SOFT DELETE)
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
