import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindLastListeningsForTrackDTO } from 'src/listenings/dto/find-last-listenings-track.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { TrackListeningsResponseDTO } from 'src/listenings/dto/responses/track-listenings-response.dto';
import { Listening } from 'src/listenings/listening.entity';
import { ListeningsService } from 'src/listenings/listenings.service';
import { UsersService } from 'src/users/users.service';

import { UpdateResult } from 'typeorm';
import { CreateTrackDTO } from './dto/create-track.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly usersService: UsersService,
    private readonly albumsService: AlbumsService,
    private readonly listeningsService: ListeningsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: { user: AuthenticatedUserDTO }, @Body() createTrackDTO: CreateTrackDTO): Promise<Track> {
    const user = await this.usersService.findOne(req.user);

    if (!user) {
      throw new UnauthorizedException();
    }


    const album = await this.albumsService.findOne({ id: createTrackDTO.album });

    if (!album) {
      throw new BadRequestException();
    }

    return new Track(await this.tracksService.create({
      ...createTrackDTO,
      user,
      album,
    }));
  }

  @Get()
  async find(): Promise<Track[]> {
    return this.tracksService.find();
  }

  @Get(':id')
  async findOne(@Param() findTrackDTO: FindTrackDTO): Promise<Track> {
    const track: Track | undefined = await this.tracksService.findOne(findTrackDTO);

    if (!track) {
      throw NotFoundException;
    }

    return track;
  }

  @Get(':id/stats')
  async findStats(@Param() findTrackDTO: FindTrackDTO, @Query() findListeningsDTO: FindListeningsDTO): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findForTrack({ ...findTrackDTO, ...findListeningsDTO })
  }

  @Get(':id/stats/last/:count/:period')
  async findLastStats(@Param() findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findLastForTrack(findLastListeningsForTrackDTO)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param() findTrackDTO: FindTrackDTO, @Body() trackData: UpdateTrackDTO): Promise<Track> {
    const result: UpdateResult = await this.tracksService.update(findTrackDTO, trackData);

    if (!result.affected || result.affected === 0) {
      throw BadRequestException;
    }

    const track: Track | undefined = await this.tracksService.findOne(findTrackDTO);

    if (!track) {
      throw BadRequestException;
    }

    return track;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/listen')
  async listen(@Param() findTrackDTO: FindTrackDTO, @Request() req: { user: AuthenticatedUserDTO }): Promise<void> {
    const user = await this.usersService.findOne(req.user);
    const track = await this.tracksService.findOne(findTrackDTO);
    const listening = new Listening({ user, track })
    await this.listeningsService.create(listening);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param() track: FindTrackDTO): void {
    this.tracksService.delete(track).then();
  }
}
