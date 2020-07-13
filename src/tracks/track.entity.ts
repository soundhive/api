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

import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../albums/album.entity';

@Entity('tracks')
export class Track extends BaseEntity {
  constructor(partial: Partial<Track>) {
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
  @Column('text')
  description: string;

  @ApiProperty()
  @Column()
  genre: string;

  @ApiProperty()
  @Column()
  filename: string;

  @ApiProperty()
  @Column()
  license: string;

  @ApiProperty()
  @Column()
  downloadable: boolean;

  @ApiProperty()
  @Column()
  duration: number; // in seconds

  @OneToMany((type) => Listening, (listening) => listening.track)
  listenings: Listening[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne((type) => Album, (album) => album.tracks, {
    nullable: false,
    eager: true,
  })
  album: Album;

  @ManyToOne(() => User, (user) => user.tracks, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;
}
