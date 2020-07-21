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
    ticket: Ticket,
    comment: CreateTicketCommentDTO,
  ): Promise<Ticket> {
    const ticketComment = new TicketComment({
      user,
      message: comment.message,
      ticket,
    });
    await this.ticketCommentRepo.save(ticketComment);

    // return ticket with new comment
    const updatedTicket = await this.findOne(ticket);
    if (!updatedTicket) {
      throw new InternalServerErrorException();
    }
    return updatedTicket;
  }

  async assignToTicket(user: User, ticket: Ticket): Promise<Ticket> {
    const updatedTicket = ticket;
    updatedTicket.assignedUser = user;

    return this.ticketRepo.save(updatedTicket);
  }

  async closeTicket(ticket: Ticket): Promise<Ticket> {
    const updatedTicket = ticket;
    updatedTicket.closed = true;

    return this.ticketRepo.save(updatedTicket);
  }
}
