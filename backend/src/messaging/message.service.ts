import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(dto: CreateMessageDto) {
    const message = this.messageRepository.create(dto);

    return await this.messageRepository.save(message);
  }

  async findAll() {
    return await this.messageRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(id: string, dto: UpdateMessageDto) {
    const message = await this.findOne(id);

    Object.assign(message, dto);

    return await this.messageRepository.save(message);
  }

  async remove(id: string) {
    const message = await this.findOne(id);

    return await this.messageRepository.remove(message);
  }

  async findRoomMessages(roomId: string) {
    return await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }
}
