/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from 'class-transformer';
import { Listening } from 'src/listenings/listening.entity';
import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('samples')
export class Sample extends BaseEntity {
  constructor(partial: Partial<Sample>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '60' })
  title: string;

  @Column('text')
  description: string;

  @Column()
  genre: string;

  @Column()
  filename: string;

  @OneToMany(type => Listening, listening => listening.sample)
  listenings: Listening[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.samples, { nullable: false, eager: true })
  @Exclude()
  user: User;

  @Column()
  visibility: string;
}
