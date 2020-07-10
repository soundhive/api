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

enum TrackFileMediaType {
  'audio/flac',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/wave',
}

@Entity('tracks')
class Track extends BaseEntity {
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

  @OneToMany((type) => Listening, (listening) => listening.track)
  listenings: Listening[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Album, (album) => album.tracks, { nullable: false })
  album: Album;

  @ManyToOne(() => User, (user) => user.tracks, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;
}

export { Track, TrackFileMediaType };
