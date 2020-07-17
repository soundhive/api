import { Track } from 'src/tracks/track.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sample } from 'src/samples/samples.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  listenedAt: Date;

  @ManyToOne(() => User, (user) => user.listenings, {
    nullable: false,
    eager: true,
  })
  user: User;

  @ApiProperty()
  @ManyToOne(() => Track, (track) => track.listenings, {
    nullable: true,
    eager: true,
  })
  track: Track;

  @ApiProperty()
  @ManyToOne(() => Sample, (sample) => sample.listenings, {
    nullable: true,
    eager: true,
  })
  sample: Sample;
}

export { Listening, ListeningPeriod };
