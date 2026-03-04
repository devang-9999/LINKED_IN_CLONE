import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EducationService } from './education/education.service';
import { ExperienceService } from './experience/experience.service';
import { SkillsService } from './skills/skills.service';

import { User } from 'src/users/entities/user.entity';
import { Education } from './education/entities/education.entity';
import { Experience } from './experience/entities/experience.entity';
import { UserSkill } from './skills/entities/user-skill.entity';
import { Skill } from './skills/entities/skill.entity';

export interface ProfileCompleteness {
  percentage: number;
  missing: string[];
}

export interface FullProfileResponse {
  user: User;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  completeness: ProfileCompleteness;
}

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly educationService: EducationService,
    private readonly experienceService: ExperienceService,
    private readonly skillsService: SkillsService,
  ) {}

  async getFullProfile(userId: string): Promise<FullProfileResponse> {
    const user = await this.usersService.findById(userId);

    const [educations, experiences, userSkills] = await Promise.all([
      this.educationService.findAllByUser(userId),
      this.experienceService.findAllByUser(userId),
      this.skillsService.getUserSkills(userId),
    ]);

    const skills: Skill[] = userSkills.map((us) => us.skill);

    const completeness = this.calculateCompleteness({
      user,
      educations,
      experiences,
      skills: userSkills,
    });

    return {
      user,
      educations,
      experiences,
      skills,
      completeness,
    };
  }
  async getMyProfile(userId: string): Promise<FullProfileResponse> {
    return this.getFullProfile(userId);
  }

  private calculateCompleteness(data: {
    user: User;
    educations: Education[];
    experiences: Experience[];
    skills: UserSkill[];
  }): ProfileCompleteness {
    let score = 0;
    const missing: string[] = [];

    if (data.user.headline) score += 15;
    else missing.push('headline');

    if (data.user.about) score += 15;
    else missing.push('about');

    if (data.user.profilePicture) score += 10;
    else missing.push('profilePicture');

    if (data.educations.length > 0) score += 20;
    else missing.push('education');

    if (data.experiences.length > 0) score += 20;
    else missing.push('experience');

    if (data.skills.length >= 3) score += 20;
    else missing.push('skills');

    return {
      percentage: score,
      missing,
    };
  }
}
