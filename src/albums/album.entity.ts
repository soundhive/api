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
import { Track } from '../tracks/track.entity';
import { User } from 'src/users/user.entity';

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

  @Column('text', { default: null, nullable: true })
  description?: string;

  @Column()
  coverFilename: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => Track, track => track.album)
  tracks: Track[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, user => user.albums, { nullable: false })
  user: User;
}
