import { Track } from 'src/tracks/track.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sample } from 'src/samples/samples.entity';

enum ListeningPeriod {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

@Entity('listening')
class Listening {
  constructor(partial: Partial<Listening>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  listenedAt: Date;

  @ManyToOne(() => User, (user) => user.listenings, { nullable: false })
  user: User;

  @ManyToOne(() => Track, (track) => track.listenings, { nullable: true })
  track: Track;

  @ManyToOne(() => Sample, (sample) => sample.listenings, { nullable: true })
  sample: Sample;
}

export { Listening, ListeningPeriod };
