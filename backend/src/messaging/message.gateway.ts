/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Socket connected:', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('Socket disconnected:', client.id);

    const userid = client.data.userid;
    if (!userid) return;

    const sockets = await this.server.in(userid).fetchSockets();

    if (sockets.length === 0) {
      await this.userRepository.update({ id: userid }, { isActive: false });

      this.server.emit('userOffline', { userid });

      console.log(`User ${userid} offline`);
    }
  }

  @SubscribeMessage('onConnection')
  async onConnection(
    @MessageBody() userid: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!userid) return;
    client.data.userid = userid;

    await client.join(userid);

    await this.userRepository.update({ id: userid }, { isActive: true });

    this.server.emit('userOnline', { userid });

    console.log(`User ${userid} joined personal room`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);
    console.log(`Socket ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(roomId);
    console.log(`Socket ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { roomId, userid } = data;

    client.to(roomId).emit('usertyping', { userid });
  }

  @SubscribeMessage('fetchMessages')
  async fetchMessages(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });

    client.emit('getMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: any) {
    const { roomId, text, senderId, receiverId } = data;

    if (!roomId || !senderId || !receiverId) return;

    const message = await this.messageRepository.save({
      roomId,
      senderId,
      receiverId,
      message: text,
    });

    this.server.to(roomId).emit('newMessage', message);
  }
}
