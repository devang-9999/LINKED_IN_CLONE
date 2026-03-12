import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private notificationService: NotificationService,
  ) {}

  // FOLLOW USER
  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepository.create({
      follower: currentUser,
      following: targetUser,
    });

    await this.followRepository.save(follow);

    // send notification
    await this.notificationService.createNotification(
      currentUser,
      targetUser,
      'started following you',
      NotificationType.FOLLOW,
    );
    return {
      message: 'User followed successfully',
    };
  }

  // UNFOLLOW USER
  async unfollowUser(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);

    return {
      message: 'User unfollowed successfully',
    };
  }

  // GET FOLLOWERS
  async getFollowers(userId: string) {
    const followers = await this.followRepository.find({
      where: {
        following: { id: userId },
      },
      relations: ['follower'],
    });

    return followers.map((follow) => follow.follower);
  }

  // GET FOLLOWING
  async getFollowing(userId: string) {
    const following = await this.followRepository.find({
      where: {
        follower: { id: userId },
      },
      relations: ['following'],
    });

    return following.map((follow) => follow.following);
  }

  // FOLLOW STATUS
  async followStatus(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    return {
      isFollowing: !!follow,
    };
  }

  // FOLLOWERS COUNT
  async getFollowersCount(userId: string) {
    const count = await this.followRepository.count({
      where: {
        following: { id: userId },
      },
    });

    return {
      followersCount: count,
    };
  }
}
