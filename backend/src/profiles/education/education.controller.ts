/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateEducationDto) {
    return this.educationService.create(req.user.userId, dto);
  }

  @Get()
  findMyEducations(@Req() req: any) {
    return this.educationService.findAllByUser(req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.educationService.remove(id, req.user.userId);
  }
  @Get('test')
  test() {
    return 'education working';
  }
}
