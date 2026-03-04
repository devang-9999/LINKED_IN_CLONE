/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async getUserId(authId: string): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id: authId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.id;
  }

  async create(authId: string, dto: CreateExperienceDto) {
    const userId = await this.getUserId(authId);

    // if (dto.currentlyWorking) {
    //   dto.endDate = null;
    // }

    const experience = this.experienceRepo.create({
      ...dto,
      user: { id: userId } as any,
    });

    return await this.experienceRepo.save(experience);
  }

  async findAllByUser(authId: string) {
    const userId = await this.getUserId(authId);

    return await this.experienceRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async update(experienceId: string, authId: string, dto: UpdateExperienceDto) {
    const userId = await this.getUserId(authId);

    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== userId) {
      throw new ForbiddenException('You cannot update this experience');
    }

    // if (dto.currentlyWorking) {
    //   dto.endDate = null;
    // }

    Object.assign(experience, dto);

    return await this.experienceRepo.save(experience);
  }

  async remove(experienceId: string, authId: string) {
    const userId = await this.getUserId(authId);

    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this experience');
    }

    await this.experienceRepo.remove(experience);

    return { message: 'Experience deleted successfully' };
  }
}
