import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketComment } from './ticket-comment.entity';

@Entity('ticket')
export class Ticket {
  constructor(partial: Partial<Ticket>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdTickets, {
    nullable: false,
    eager: true,
  })
  @ApiProperty({ type: () => User })
  creator: User;

  @ManyToOne(() => User, (user) => user.assignedTickets, {
    nullable: true,
    eager: true,
  })
  @ApiProperty({ type: () => User })
  assignedUser: User;

  @OneToMany(() => TicketComment, (comment) => comment.ticket, {
    nullable: false,
    eager: true,
  })
  @ApiProperty({ type: () => Ticket })
  comments: TicketComment[];

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @Column()
  title: string;
}
