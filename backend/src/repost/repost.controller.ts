/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';
import { RepostsService } from './repost.service';

@Controller('reposts')
@UseGuards(JwtAuthGuard)
export class RepostsController {
  constructor(private readonly repostsService: RepostsService) {}

  // CREATE REPOST
  @Post(':postId')
  create(
    @Param('postId') postId: string,
    @Req() req,
    @Body() body: { message?: string },
  ) {
    return this.repostsService.create(req.user.userId, postId, body.message);
  }

  @Get()
  findAll() {
    return this.repostsService.findAll();
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.repostsService.findByPost(postId);
  }

  @Delete(':postId')
  remove(@Param('postId') postId: string, @Req() req) {
    return this.repostsService.remove(req.user.userId, postId);
  }
}
