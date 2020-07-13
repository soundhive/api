/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('follows')
export class Follow extends BaseEntity {
  constructor(partial: Partial<Follow>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @ApiProperty()
  followedAt: Date;

  @ManyToOne((type) => User, (user) => user.followers, { eager: true })
  @ApiProperty({ type: () => User })
  to: User;

  @ApiProperty({ type: () => User })
  from: User;
}
