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

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  followUser(@Req() req, @Param('userId') userId: string) {
    const currentUserId = req.user.id;

    return this.followService.followUser(currentUserId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  unfollowUser(@Req() req, @Param('userId') userId: string) {
    const currentUserId = req.user.id;

    return this.followService.unfollowUser(currentUserId, userId);
  }

  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }

  @Get('status/:userId')
  @UseGuards(JwtAuthGuard)
  checkFollowStatus(@Req() req, @Param('userId') userId: string) {
    const currentUserId = req.user.id;
    return this.followService.followStatus(currentUserId, userId);
  }

  @Get('count/:userId')
  getFollowersCount(@Param('userId') userId: string) {
    return this.followService.getFollowersCount(userId);
  }
}
