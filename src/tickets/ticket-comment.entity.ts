import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket-comment')
export class TicketComment {
  constructor(partial: Partial<TicketComment>) {
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

  @ManyToOne(() => User, (user) => user.ticketComments, {
    nullable: false,
    eager: true,
  })
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.comments, {
    nullable: false,
    eager: false,
  })
  ticket: Ticket;

  @ApiProperty()
  @Column()
  message: string;
}
