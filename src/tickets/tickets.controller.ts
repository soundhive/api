import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { CreateTicketCommentDTO } from './dto/create-ticket-comment.dto';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { FindTicketDTO } from './dto/find-ticket.dto';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @ApiOperation({ summary: 'Post a ticket' })
  @ApiCreatedResponse({ type: Ticket, description: 'Ticket object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createTicketDTO: CreateTicketDTO,
  ): Promise<Ticket> {
    return this.ticketService.create({ ...createTicketDTO, creator: req.user });
  }

  @ApiOperation({ summary: 'Get own tickets' })
  @ApiOkResponse({ type: [Ticket], description: 'User tickets' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findSelfTickets(@Request() req: ValidatedJWTReq): Promise<Ticket[]> {
    return this.ticketService.findBy({ where: { creator: req.user } });
  }

  @ApiOperation({ summary: 'Get a ticket' })
  @ApiOkResponse({ type: Ticket, description: 'Ticket object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTicket(
    @Param() ticketRequest: FindTicketDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<Ticket> {
    const ticket = await this.ticketService.findOne(ticketRequest);

    if (ticket?.creator.id !== req.user.id) {
      throw new ForbiddenException("You can't see this ticket.");
    }

    return ticket;
  }

  @ApiOperation({ summary: 'Post a comment to a ticket' })
  @ApiCreatedResponse({ type: Ticket, description: 'Ticket object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async addCommentToTicket(
    @Request() req: ValidatedJWTReq,
    @Param() ticketDTO: FindTicketDTO,
    @Body() createTicketDTO: CreateTicketCommentDTO,
  ): Promise<Ticket> {
    const ticketEntity = await this.ticketService.findOne(ticketDTO);

    if (ticketEntity?.creator.id !== req.user.id) {
      throw new ForbiddenException("You can't see this ticket.");
    }

    return this.ticketService.addCommentToTicket(
      req.user,
      ticketEntity,
      createTicketDTO,
    );
  }
}
