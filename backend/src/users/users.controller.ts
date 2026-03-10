/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { multerOptions } from 'src/config/multerConfiguration/multerConfiguration';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req: any) {
    // const userId = req.user.sub;
    const userId = req.user.userId;
    return this.usersService.getMyProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/complete-profile')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  completeProfile(
    @Req() req: any,
    @Body() dto: CompleteProfileDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
  ) {
    // const userId = req.user.sub;
    const userId = req.user.userId;

    const profilePicture = files?.profilePicture?.[0]?.filename;
    const coverPicture = files?.coverPicture?.[0]?.filename;

    return this.usersService.completeProfile(
      userId,
      dto,
      profilePicture,
      coverPicture,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    // const userId = req.user.sub;
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadProfilePicture(@Req() req: any, @UploadedFile() file: any) {
    // const userId = req.user.sub;
    const userId = req.user.userId;
    return this.usersService.updateProfilePicture(userId, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/cover-picture')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadCoverPicture(@Req() req: any, @UploadedFile() file: any) {
    // const userId = req.user.sub;
    const userId = req.user.userId;
    return this.usersService.updateCoverPicture(userId, file.filename);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
