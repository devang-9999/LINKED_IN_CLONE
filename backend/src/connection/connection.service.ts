import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Connection, ConnectionStatus } from './entities/connection.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // SEND CONNECTION REQUEST
  async sendRequest(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot connect with yourself');
    }

    const sender = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const receiver = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    const existingConnection = await this.connectionRepository.findOne({
      where: [
        { sender: { id: currentUserId }, receiver: { id: targetUserId } },
        { sender: { id: targetUserId }, receiver: { id: currentUserId } },
      ],
    });

    if (existingConnection) {
      throw new BadRequestException('Connection request already exists');
    }

    const connection = this.connectionRepository.create({
      sender,
      receiver,
      status: ConnectionStatus.PENDING,
    });

    await this.connectionRepository.save(connection);

    return {
      message: 'Connection request sent',
    };
  }

  // ACCEPT CONNECTION REQUEST
  async acceptRequest(connectionId: string, currentUserId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['receiver'],
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    if (connection.receiver.id !== currentUserId) {
      throw new BadRequestException('Not authorized to accept this request');
    }

    connection.status = ConnectionStatus.ACCEPTED;

    await this.connectionRepository.save(connection);

    return {
      message: 'Connection request accepted',
    };
  }

  // REJECT CONNECTION REQUEST
  async rejectRequest(connectionId: string, currentUserId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['receiver'],
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    if (connection.receiver.id !== currentUserId) {
      throw new BadRequestException('Not authorized to reject this request');
    }

    connection.status = ConnectionStatus.REJECTED;

    await this.connectionRepository.save(connection);

    return {
      message: 'Connection request rejected',
    };
  }

  // GET RECEIVED REQUESTS
  async getReceivedRequests(userId: string) {
    return this.connectionRepository.find({
      where: {
        receiver: { id: userId },
        status: ConnectionStatus.PENDING,
      },
      relations: ['sender'],
    });
  }

  // GET SENT REQUESTS
  async getSentRequests(userId: string) {
    return this.connectionRepository.find({
      where: {
        sender: { id: userId },
        status: ConnectionStatus.PENDING,
      },
      relations: ['receiver'],
    });
  }

  // GET CONNECTIONS (ACCEPTED)
  async getConnections(userId: string) {
    const connections = await this.connectionRepository.find({
      where: [
        { sender: { id: userId }, status: ConnectionStatus.ACCEPTED },
        { receiver: { id: userId }, status: ConnectionStatus.ACCEPTED },
      ],
      relations: ['sender', 'receiver'],
    });

    return connections.map((connection) => {
      if (connection.sender.id === userId) {
        return connection.receiver;
      }
      return connection.sender;
    });
  }
}
