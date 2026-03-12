/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // FOLLOW USER
  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  followUser(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.userId;

    return this.followService.followUser(currentUserId, userId);
  }

  // UNFOLLOW USER
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  unfollowUser(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.userId;

    return this.followService.unfollowUser(currentUserId, userId);
  }

  // GET FOLLOWERS
  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  // GET FOLLOWING
  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }

  // FOLLOW STATUS
  @UseGuards(JwtAuthGuard)
  @Get('status/:userId')
  checkFollowStatus(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.userId;

    return this.followService.followStatus(currentUserId, userId);
  }

  // FOLLOWERS COUNT
  @Get('count/:userId')
  getFollowersCount(@Param('userId') userId: string) {
    return this.followService.getFollowersCount(userId);
  }
}
