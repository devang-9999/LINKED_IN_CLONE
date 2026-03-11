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
  getNotifications(@Req() req) {
    return this.notificationService.getNotifications(req.user.id);
  }

  // GET UNREAD COUNT
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.notificationService.getUnreadCount(req.user.id);
  }
}
