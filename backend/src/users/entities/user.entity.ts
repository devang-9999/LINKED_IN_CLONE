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
import { Post } from 'src/posts/entities/post.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Connection } from 'src/connection/entities/connection.entity';
import { Repost } from 'src/repost/entities/repost.entity';
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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Connection, (connection) => connection.sender)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.receiver)
  receivedConnections: Connection[];

  @OneToMany(() => Repost, (repost) => repost.user)
  reposts: Repost[];
}
