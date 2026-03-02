import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,
  ) {}

  async create(user: User, dto: CreateEducationDto) {
    const education = this.educationRepo.create({
      ...dto,
      user,
    });

    return this.educationRepo.save(education);
  }

  async findAllByUser(userId: string) {
    return this.educationRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async update(educationId: string, userId: string, dto: UpdateEducationDto) {
    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== userId) {
      throw new ForbiddenException();
    }

    Object.assign(education, dto);

    return this.educationRepo.save(education);
  }

  async remove(educationId: string, userId: string) {
    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== userId) {
      throw new ForbiddenException();
    }

    await this.educationRepo.remove(education);

    return { message: 'Education deleted successfully' };
  }
}
