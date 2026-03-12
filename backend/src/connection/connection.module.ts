import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Connection } from './entities/connection.entity';
import { User } from 'src/users/entities/user.entity';

import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationController } from 'src/notifications/notification.controller';
import { NotificationGateway } from 'src/notifications/notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User, Notification])],
  providers: [ConnectionService, NotificationGateway, NotificationService],
  controllers: [ConnectionController, NotificationController],
})
export class ConnectionModule {}
