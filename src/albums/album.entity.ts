/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({ type: () => Track })
  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @ApiProperty({ type: () => User })
  @ManyToOne((type) => User, (user) => user.albums, {
    nullable: false,
    eager: true,
  })
  user: User;

  // Not a column!
  @ApiPropertyOptional()
  duration?: number;

  // Not a column!
  @ApiPropertyOptional()
  listeningCount?: number;
}
