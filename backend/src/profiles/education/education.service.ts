/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { Auth } from 'src/auth/entities/auth.entity'; // adjust path if needed
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,

    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async getUserIdFromAuth(userId: string): Promise<string> {
    const auth = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!auth) {
      throw new NotFoundException('User not found');
    }

    return auth.id;
  }

  async create(authId: string, dto: CreateEducationDto) {
    const userId = await this.getUserIdFromAuth(authId);
    const education = this.educationRepo.create({
      ...dto,
      user: { id: userId } as any,
    });

    return await this.educationRepo.save(education);
  }

  async findAllByUser(authId: string) {
    const userId = await this.getUserIdFromAuth(authId);

    return await this.educationRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async update(educationId: string, authId: string, dto: UpdateEducationDto) {
    const userId = await this.getUserIdFromAuth(authId);

    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== userId) {
      throw new ForbiddenException('You cannot update this education');
    }

    Object.assign(education, dto);

    return await this.educationRepo.save(education);
  }

  async remove(educationId: string, authId: string) {
    const userId = await this.getUserIdFromAuth(authId);

    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this education');
    }

    await this.educationRepo.remove(education);

    return { message: 'Education deleted successfully' };
  }
}
