/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // user connected
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      client.join(userId);
      console.log(`User ${userId} connected to socket`);
    }
  }

  // user disconnected
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;

    console.log(`User ${userId} disconnected`);
  }

  // send notification to a specific user
  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }

  // update unread badge
  sendUnreadCount(userId: string, count: number) {
    this.server.to(userId).emit('notification-count', {
      unreadCount: count,
    });
  }
}
