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
  ) {}

  private normalizeSkillName(name: string) {
    return name.trim().toLowerCase();
  }

  async addSkill(user: User, dto: AddSkillDto) {
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
        user: { id: user.id },
        skill: { id: skill.id },
      },
    });

    if (existing) {
      throw new ConflictException('Skill already added');
    }

    const userSkill = this.userSkillRepo.create({
      user,
      skill,
    });

    return this.userSkillRepo.save(userSkill);
  }

  async getUserSkills(userId: string) {
    return this.userSkillRepo.find({
      where: { user: { id: userId } },
      relations: ['skill'],
      order: { skill: { name: 'ASC' } },
    });
  }

  async removeSkill(userId: string, skillId: string) {
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
