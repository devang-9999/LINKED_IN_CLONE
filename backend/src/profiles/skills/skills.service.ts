import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Skill } from './entities/skill.entity';
import { UserSkill } from './entities/user-skill.entity';
import { AddSkillDto } from './dto/add-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,

    @InjectRepository(UserSkill)
    private readonly userSkillRepo: Repository<UserSkill>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private normalizeSkillName(name: string) {
    return name.trim().toLowerCase();
  }

  private async getUserId(authId: string): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id: authId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.id;
  }

  async addSkill(authId: string, dto: AddSkillDto) {
    const userId = await this.getUserId(authId);

    const normalized = this.normalizeSkillName(dto.name);

    let skill = await this.skillRepo.findOne({
      where: { name: normalized },
    });

    if (!skill) {
      skill = this.skillRepo.create({ name: normalized });
      skill = await this.skillRepo.save(skill);
    }

    const existing = await this.userSkillRepo.findOne({
      where: {
        user: { id: userId },
        skill: { id: skill.id },
      },
    });

    if (existing) {
      throw new ConflictException('Skill already added');
    }

    const userSkill = this.userSkillRepo.create({
      user: { id: userId },
      skill,
    });

    return this.userSkillRepo.save(userSkill);
  }

  async getUserSkills(authId: string) {
    const userId = await this.getUserId(authId);

    return this.userSkillRepo.find({
      where: { user: { id: userId } },
      relations: ['skill'],
      order: { skill: { name: 'ASC' } },
    });
  }

  async removeSkill(authId: string, skillId: string) {
    const userId = await this.getUserId(authId);

    const userSkill = await this.userSkillRepo.findOne({
      where: {
        user: { id: userId },
        skill: { id: skillId },
      },
      relations: ['skill'],
    });

    if (!userSkill) {
      throw new NotFoundException('Skill not found for user');
    }

    await this.userSkillRepo.remove(userSkill);

    return { message: 'Skill removed successfully' };
  }
}
