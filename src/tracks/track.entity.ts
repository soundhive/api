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

import { Album } from '../albums/album.entity';

@Entity('tracks')
export class Track extends BaseEntity {
  constructor(partial: Partial<Track>) {
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

  @OneToMany(type => Listening, listening => listening.track)
  listenings: Listening[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => Album, album => album.tracks, { nullable: false })
  album: Album;

  @ManyToOne(() => User, user => user.tracks, { nullable: false })
  @Exclude()
  user: User;
}
