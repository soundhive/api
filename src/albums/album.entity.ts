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
import { ApiProperty } from '@nestjs/swagger';
import { Track } from '../tracks/track.entity';

@Entity('albums')
export class Album extends BaseEntity {
  constructor(partial: Partial<Album>) {
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

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @ManyToOne((type) => User, (user) => user.albums, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;
}
