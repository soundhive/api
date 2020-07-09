/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Exclude } from 'class-transformer';
import { Track } from '../tracks/track.entity';

@Entity('albums')
export class Album extends BaseEntity {
  constructor(partial: Partial<Album>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '60' })
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  coverFilename: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @ManyToOne((type) => User, (user) => user.albums, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;
}
