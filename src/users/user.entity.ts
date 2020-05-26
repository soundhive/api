import argon2 = require('argon2');
import { Exclude } from 'class-transformer';
import { Album } from 'src/albums/album.entity';
import { Listening } from 'src/listenings/listening.entity';
import { Track } from 'src/tracks/track.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('users')
@Unique(['username', 'email'])
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => Listening, listening => listening.user)
  listenings: Listening[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => Track, track => track.user)
  tracks: Track[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => Album, album => album.user)
  albums: Album[];

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @VersionColumn()
  dataVersion: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
