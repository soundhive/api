import { Track } from 'src/tracks/track.entity';
import { User } from 'src/users/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listening')
export class Listening {
  constructor(partial: Partial<Listening>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  listenedAt: Date;

  @ManyToOne(() => User, user => user.listenings)
  user: User;

  @ManyToOne(() => Track, track => track.listenings)
  track: Track;
}
