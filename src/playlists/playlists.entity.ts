/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Track } from '../tracks/track.entity';

@Entity('playlists')
export class Playlist extends BaseEntity {
  constructor(partial: Partial<Playlist>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: '60' })
  title: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty()
  @Column()
  coverFilename: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @ManyToMany((type) => Track, (track) => track.playlists, { eager: true })
  @JoinTable()
  tracks: Track[];

  @ManyToOne((type) => User, (user) => user.playlists, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;
}
