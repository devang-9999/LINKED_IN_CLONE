import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Skill } from './skill.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('user_skills')
@Unique(['user', 'skill'])
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: 'CASCADE' })
  skill: Skill;
}
