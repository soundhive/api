/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('follows')
export class Follow {
  constructor(partial: Partial<Follow>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  followedAt: Date;

  @ManyToOne((type) => User, (user) => user.followers, { eager: true })
  to: User;

  @ManyToOne((type) => User, (user) => user.followers, { eager: true })
  from: User;
}
