import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    private notificationGateway: NotificationGateway,
  ) {}

  // CREATE NOTIFICATION
  async createNotification(
    sender: User,
    receiver: User,
    message: string,
    type: string = 'FOLLOW',
  ) {
    const notification = this.notificationRepo.create({
      sender,
      receiver,
      message,
      type,
      isRead: false,
    });

    const savedNotification = await this.notificationRepo.save(notification);

    // send realtime notification
    this.notificationGateway.sendNotification(receiver.id, savedNotification);

    // update unread count
    const unreadCount = await this.getUnreadCount(receiver.id);
    this.notificationGateway.sendUnreadCount(receiver.id, unreadCount);

    return savedNotification;
  }

  // GET ALL NOTIFICATIONS
  async getNotifications(userId: string) {
    return this.notificationRepo.find({
      where: {
        receiver: { id: userId },
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET UNREAD COUNT
  async getUnreadCount(userId: string) {
    return this.notificationRepo.count({
      where: {
        receiver: { id: userId },
        isRead: false,
      },
    });
  }

  // MARK AS READ
  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
      relations: ['receiver'],
    });

    if (!notification) {
      return null;
    }

    notification.isRead = true;
    await this.notificationRepo.save(notification);

    // update unread count after marking read
    const unreadCount = await this.getUnreadCount(notification.receiver.id);

    this.notificationGateway.sendUnreadCount(
      notification.receiver.id,
      unreadCount,
    );

    return notification;
  }

  // MARK ALL AS READ
  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      {
        receiver: { id: userId },
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    this.notificationGateway.sendUnreadCount(userId, 0);

    return {
      message: 'All notifications marked as read',
    };
  }
}
