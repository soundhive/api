import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Track } from 'src/tracks/track.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
export class Favorite extends BaseEntity {
  constructor(partial: Partial<Favorite>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  favoritedAt: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.favorites, {
    nullable: false,
    eager: true,
  })
  user: User;

  @ApiProperty({ type: () => Track })
  @ManyToOne(() => Track, (track) => track.favoriters, {
    nullable: true,
    eager: true,
  })
  track: Track;
}
