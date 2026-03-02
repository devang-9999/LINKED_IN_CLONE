/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FullProfileResponse, ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req): Promise<FullProfileResponse> {
    return this.profilesService.getMyProfile(req.user.id);
  }

  @Get(':userId')
  getPublicProfile(@Param('userId') userId: string) {
    return this.profilesService.getFullProfile(userId);
  }
}
