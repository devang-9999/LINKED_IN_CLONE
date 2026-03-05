import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';

import { TypingDto } from './dto/typing.dto';
import { SendMessageDto } from './dto/send-message.dto';

interface AuthenticatedSocket extends Socket {
  data: {
    userid?: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Socket connected:', client.id);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userid = client.data.userid;

    if (!userid) return;

    const sockets = await this.server.in(userid).fetchSockets();

    if (sockets.length === 0) {
      await this.authRepository.update(
        { user: { id: userid } },
        { isActive: false },
      );

      this.server.emit('userOffline', { userid });
    }
  }

  @SubscribeMessage('onConnection')
  async onConnection(
    @MessageBody() userid: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.data.userid = userid;

    await client.join(userid);

    await this.authRepository.update(
      { user: { id: userid } },
      { isActive: true },
    );

    this.server.emit('userOnline', { userid });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(roomId);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: TypingDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { roomId, userid } = data;

    client.to(roomId).emit('usertyping', { userid });
  }

  @SubscribeMessage('fetchMessages')
  async fetchMessages(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const messages = await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });

    client.emit('getMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: SendMessageDto) {
    const { roomId, senderId, receiverId, text } = data;

    const message = this.messageRepository.create({
      roomId,
      senderId,
      receiverId,
      message: text,
    });

    const savedMessage = await this.messageRepository.save(message);

    this.server.to(roomId).emit('newMessage', savedMessage);
  }
}
