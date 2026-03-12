/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Post, Get, Param, Req, UseGuards } from '@nestjs/common';

import { ConnectionService } from './connection.service';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  // SEND REQUEST
  @UseGuards(JwtAuthGuard)
  @Post('request/:userId')
  sendRequest(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.userId;

    return this.connectionService.sendRequest(currentUserId, userId);
  }

  // ACCEPT REQUEST
  @UseGuards(JwtAuthGuard)
  @Post('accept/:connectionId')
  acceptRequest(@Req() req: any, @Param('connectionId') connectionId: string) {
    const currentUserId = req.user.userId;

    return this.connectionService.acceptRequest(connectionId, currentUserId);
  }

  // REJECT REQUEST
  @UseGuards(JwtAuthGuard)
  @Post('reject/:connectionId')
  rejectRequest(@Req() req: any, @Param('connectionId') connectionId: string) {
    const currentUserId = req.user.userId;

    return this.connectionService.rejectRequest(connectionId, currentUserId);
  }

  // RECEIVED REQUESTS
  @UseGuards(JwtAuthGuard)
  @Get('requests')
  getReceivedRequests(@Req() req: any) {
    const currentUserId = req.user.userId;

    return this.connectionService.getReceivedRequests(currentUserId);
  }

  // SENT REQUESTS
  @UseGuards(JwtAuthGuard)
  @Get('sent')
  getSentRequests(@Req() req: any) {
    const currentUserId = req.user.userId;

    return this.connectionService.getSentRequests(currentUserId);
  }

  // GET ALL CONNECTIONS
  @UseGuards(JwtAuthGuard)
  @Get()
  getConnections(@Req() req: any) {
    const currentUserId = req.user.userId;

    return this.connectionService.getConnections(currentUserId);
  }
}
