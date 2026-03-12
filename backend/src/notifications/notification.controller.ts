/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // GET ALL NOTIFICATIONS
  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@Req() req: any) {
    const userId = req.user.userId;

    return this.notificationService.getNotifications(userId);
  }

  // GET UNREAD COUNT
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = req.user.userId;

    return this.notificationService.getUnreadCount(userId);
  }
}
