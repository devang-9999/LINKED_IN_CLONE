import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
