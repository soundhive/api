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
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindLastListeningsForTrackDTO } from 'src/listenings/dto/find-last-listenings-track.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { TrackListeningsResponseDTO } from 'src/listenings/dto/responses/track-listenings-response.dto';
import { Listening } from 'src/listenings/listening.entity';
import { ListeningsService } from 'src/listenings/listenings.service';

import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { CreateTrackDTO } from './dto/create-track.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';
import { CreateTrackAPIBody } from './dto/create-track-api-body.dto';
import { UpdateTrackAPIBody } from './dto/update-track-api-body.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly listeningsService: ListeningsService,
  ) {}

  @ApiOperation({ summary: 'Post a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTrackAPIBody })
  @ApiCreatedResponse({ type: Track, description: 'Track object' })
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
  @UseInterceptors(FileInterceptor('trackFile'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createTrackDTO: CreateTrackDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Track> {
    if (!file) {
      throw new BadRequestException('Missing track file');
    }

    const album = await this.albumsService.findOne({
      id: createTrackDTO.album,
    });

    if (!album) {
      throw new BadRequestException('Invalid album');
    }

    const filename: string = await this.tracksService.uploadTrackFile(file);

    return this.tracksService.create(
      new Track({
        ...createTrackDTO,
        downloadable: createTrackDTO.downloadable === 'true',
        user: req.user,
        album,
        filename,
      }),
    );
  }

  @ApiOperation({ summary: 'Update a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTrackAPIBody })
  @ApiOkResponse({ type: Track, description: 'Track object' })
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
  @UseInterceptors(FileInterceptor('trackFile'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findTrackDTO: FindTrackDTO,
    @Body() trackData: UpdateTrackDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Track> {
    const existingTrack = await this.tracksService.findOne(findTrackDTO);

    if (!existingTrack) {
      throw new BadRequestException('Could not find track');
    }

    if (existingTrack.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    let filename: string;
    if (file) {
      filename = await this.tracksService.uploadTrackFile(file);
    } else {
      filename = existingTrack.filename;
    }

    const result: UpdateResult = await this.tracksService.update(findTrackDTO, {
      ...trackData,
      filename,
    });

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update track.');
    }

    // Fetch updated track
    const updatedTrack = await this.tracksService.findOne(findTrackDTO);

    if (!updatedTrack) {
      throw new BadRequestException('Could not find track');
    }

    return updatedTrack;
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [Track], description: 'Track objects' })
  @Get()
  async find(): Promise<Track[]> {
    return this.tracksService.find();
  }

  @ApiOperation({ summary: 'Get a track' })
  @ApiOkResponse({ type: Track, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findTrackDTO: FindTrackDTO): Promise<Track> {
    const track: Track | undefined = await this.tracksService.findOne(
      findTrackDTO,
    );

    if (!track) {
      throw NotFoundException;
    }

    return track;
  }

  @ApiOperation({ summary: "Get a track's statistics" })
  @ApiOkResponse({
    type: TrackListeningsResponseDTO,
    description: 'Stats for the track',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/stats')
  async findStats(
    @Param() findTrackDTO: FindTrackDTO,
    @Query() findListeningsDTO: FindListeningsDTO,
  ): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findForTrack({
      ...findTrackDTO,
      ...findListeningsDTO,
    });
  }

  @ApiOperation({ summary: "Get a track's statistics" })
  @ApiOkResponse({
    type: TrackListeningsResponseDTO,
    description: 'Stats for the track',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/stats/last/:count/:period')
  async findLastStats(
    @Param() findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO,
  ): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findLastForTrack(
      findLastListeningsForTrackDTO,
    );
  }

  @ApiOperation({ summary: 'Increment listening count' })
  @ApiCreatedResponse({
    description: 'Success',
  })
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
  @Post(':id/listen')
  async listen(
    @Param() findTrackDTO: FindTrackDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<void> {
    const track = await this.tracksService.findOne(findTrackDTO);
    const listening = new Listening({ user: req.user, track });
    await this.listeningsService.create(listening);
  }

  @ApiOperation({ summary: 'Delete track' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
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
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Request() req: ValidatedJWTReq,
    @Param() track: FindTrackDTO,
  ): Promise<void> {
    const trackToDelete = await this.tracksService.findOne(track);

    if (trackToDelete?.user.id !== req.user.id) {
      throw new ForbiddenException(['You do not own this track.']);
    }

    await this.tracksService.delete(track);
  }
}
