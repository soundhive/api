import { Listening } from 'src/listenings/listening.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Album } from '../albums/album.entity';

@Entity('tracks')
export class Track {
  constructor(partial: Partial<Track>) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Album, album => album.tracks)
  album: Album;
}
