/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { SkillsService } from './skills.service';
import { AddSkillDto } from './dto/add-skill.dto';
import { JwtAuthGuard } from 'src/auth/jwtGaurds/jwt-auth.gaurd';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  addSkill(@Request() req, @Body() dto: AddSkillDto) {
    return this.skillsService.addSkill(req.user.id, dto);
  }

  @Get()
  getMySkills(@Request() req) {
    return this.skillsService.getUserSkills(req.user.id);
  }

  @Delete(':skillId')
  removeSkill(@Request() req, @Param('skillId') skillId: string) {
    return this.skillsService.removeSkill(req.user.id, skillId);
  }
}
