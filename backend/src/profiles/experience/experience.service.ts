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
  ) {}

  async create(user: User, dto: CreateExperienceDto) {
    // if (dto.currentlyWorking) {
    //   dto.endDate = null;
    // }

    const experience = this.experienceRepo.create({
      ...dto,
      user,
    });

    return this.experienceRepo.save(experience);
  }

  async findAllByUser(userId: string) {
    return this.experienceRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async update(experienceId: string, userId: string, dto: UpdateExperienceDto) {
    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== userId) {
      throw new ForbiddenException();
    }

    // if (dto.currentlyWorking) {
    //   dto.endDate = null;
    // }

    Object.assign(experience, dto);

    return this.experienceRepo.save(experience);
  }

  async remove(experienceId: string, userId: string) {
    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== userId) {
      throw new ForbiddenException();
    }

    await this.experienceRepo.remove(experience);

    return { message: 'Experience deleted successfully' };
  }
}
