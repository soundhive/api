import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTicketCommentDTO } from './dto/create-ticket-comment.dto';
import { FindTicketDTO } from './dto/find-ticket.dto';
import { InsertTicketDTO } from './dto/insert-ticket-dto';
import { TicketComment } from './ticket-comment.entity';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketComment)
    private ticketCommentRepo: Repository<TicketComment>,
  ) {}

  async create(insertTicketDTO: InsertTicketDTO): Promise<Ticket> {
    const ticket = new Ticket(insertTicketDTO);

    return this.ticketRepo.save(ticket);
  }

  async find(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findBy(params: {}): Promise<Ticket[]> {
    return this.ticketRepo.find(params);
  }

  async findOne(ticket: FindTicketDTO): Promise<Ticket | undefined> {
    return this.ticketRepo.findOne({ id: ticket.id });
  }

  async addCommentToTicket(
    user: User,
    ticket: FindTicketDTO,
    comment: CreateTicketCommentDTO,
  ): Promise<Ticket> {
    const ticketEntity = await this.findOne(ticket);
    const ticketComment = new TicketComment({
      user,
      message: comment.message,
      ticket: ticketEntity,
    });
    await this.ticketCommentRepo.save(ticketComment);

    // return ticket with new comment
    const updatedTicket = await this.findOne(ticket);
    if (!updatedTicket) {
      throw new InternalServerErrorException();
    }
    return updatedTicket;
  }
}
