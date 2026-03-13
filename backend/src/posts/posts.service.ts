import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // async create(createPostDto: CreatePostDto): Promise<Post> {
  //   const post = this.postRepository.create(createPostDto);
  //   return await this.postRepository.save(post);
  // }

  async create(
    createPostDto: CreatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    if (file) {
      createPostDto.mediaUrl = `/uploads/${file.filename}`;

      createPostDto.mediaType = file.mimetype.startsWith('video')
        ? 'video'
        : 'image';
    }

    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'likes', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    Object.assign(post, updatePostDto);

    return this.postRepository.save(post);
  }

  async remove(id: string): Promise<{ message: string }> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.remove(post);

    return { message: 'Post deleted successfully' };
  }
}
