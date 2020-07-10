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
import { ApiProperty } from '@nestjs/swagger';

enum SampleFileMediaType {
  'audio/flac',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/wave',
}

@Entity('samples')
class Sample extends BaseEntity {
  constructor(partial: Partial<Sample>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '60' })
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  filename: string;

  @OneToMany((type) => Listening, (listening) => listening.sample)
  listenings: Listening[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.samples, {
    nullable: false,
    eager: true,
  })
  @Exclude()
  user: User;

  @Column()
  @ApiProperty()
  visibility: string;

  @Column()
  @ApiProperty()
  license: string;

  @Column()
  @ApiProperty()
  downloadable: boolean;
}
export { Sample, SampleFileMediaType };
