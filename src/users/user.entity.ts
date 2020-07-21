/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Album } from 'src/albums/album.entity';
import { Favorite } from 'src/favorites/favorite.entity';
import { Follow } from 'src/follows/follow.entity';
import { Listening } from 'src/listenings/listening.entity';
import { Playlist } from 'src/playlists/playlists.entity';
import { Sample } from 'src/samples/samples.entity';
import { TicketComment } from 'src/tickets/ticket-comment.entity';
import { Ticket } from 'src/tickets/ticket.entity';
import { Track } from 'src/tracks/track.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import argon2 = require('argon2');

@Entity('users')
@Unique(['username', 'email'])
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column()
  email: string;

  @OneToMany((type) => Listening, (listening) => listening.user)
  listenings: Listening[];

  @OneToMany((type) => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany((type) => Track, (track) => track.user)
  tracks: Track[];

  @OneToMany((type) => Album, (album) => album.user)
  albums: Album[];

  @OneToMany((type) => Sample, (sample) => sample.user)
  samples: Sample[];

  @OneToMany((type) => Follow, (follow) => follow.to)
  followers: Follow[];

  @OneToMany((type) => Follow, (follow) => follow.from)
  followings: Follow[];

  @OneToMany((type) => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @OneToMany((type) => Ticket, (ticket) => ticket.creator)
  createdTickets: Ticket[];

  @OneToMany((type) => Ticket, (ticket) => ticket.creator)
  assignedTickets: Ticket[];

  @OneToMany((type) => TicketComment, (ticketComment) => ticketComment.user)
  ticketComments: TicketComment[];

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @VersionColumn()
  dataVersion: number;

  @ApiProperty()
  @Column()
  profilePicture: string;

  @ApiPropertyOptional()
  following?: boolean;

  @ApiPropertyOptional()
  followerCount?: number;

  @ApiPropertyOptional()
  followingCount?: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password);
  }
}
