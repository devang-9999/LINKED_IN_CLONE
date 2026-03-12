import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), NotificationModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
