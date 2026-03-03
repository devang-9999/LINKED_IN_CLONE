import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Education } from 'src/profiles/education/entities/education.entity';
import { Experience } from 'src/profiles/experience/entities/experience.entity';
import { UserSkill } from 'src/profiles/skills/entities/user-skill.entity';
import { Auth } from 'src/auth/entities/auth.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  coverPicture?: string;

  @Column({ nullable: true })
  headline?: string;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @OneToMany(() => Education, (education) => education.user, { cascade: true })
  educations?: Education[];

  @OneToMany(() => Experience, (experience) => experience.user, {
    cascade: true,
  })
  experiences?: Experience[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user, { cascade: true })
  skills?: UserSkill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
