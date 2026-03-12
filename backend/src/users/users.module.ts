import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FollowService } from 'src/follow/follow.service';
import { Follow } from 'src/follow/entities/follow.entity';
import { Connection } from 'src/connection/entities/connection.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationGateway } from 'src/notifications/notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, Connection, Notification])],
  controllers: [UsersController],
  providers: [
    UsersService,
    FollowService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [UsersService],
})
export class UsersModule {}
