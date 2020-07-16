import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  UploadedFile,
  Request,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Put,
  ForbiddenException,
  HttpCode,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { BufferedFile } from 'src/minio-client/file.model';
import { Track } from 'src/tracks/track.entity';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ListeningsService } from 'src/listenings/listenings.service';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistAPIBody } from './dto/create-playlist-api-body.dto';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { Playlist } from './playlists.entity';
import { FindPlaylistDTO } from './dto/find-playlist.dto';
import { UpdatePlaylistDTO } from './dto/update-playlist.dto';
import { UpdatePlaylistAPIBody } from './dto/update-playlist-api-body.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(
    private readonly playlistsService: PlaylistsService,
    private readonly listeningsService: ListeningsService,
  ) {}

  @ApiOperation({ summary: 'Create a playlist' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePlaylistAPIBody })
  @ApiCreatedResponse({ type: Playlist, description: 'Playlist object' })
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
  @UseInterceptors(FileInterceptor('cover_file'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createPlaylistDTO: CreatePlaylistDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Playlist> {
    if (!coverFile) {
      throw new BadRequestException('Missing cover_file');
    }

    const tracks: string[] = JSON.parse(createPlaylistDTO.tracks);

    // eslint-disable-next-line no-param-reassign
    delete createPlaylistDTO.tracks;

    const playlist = await this.playlistsService.create(
      {
        ...createPlaylistDTO,
        user: req.user,
      },
      coverFile,
      tracks,
    );

    return playlist;
  }

  @ApiOperation({ summary: 'Get all playlists and their tracks' })
  @ApiOkResponse({ type: [Playlist], description: 'Playlist objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Playlist>> {
    return this.playlistsService.paginate({
      page: paginationQuery.page ? paginationQuery.page : 1,
      limit: paginationQuery.limit ? paginationQuery.limit : 10,
      route: '/playlists',
    });
  }

  @ApiOperation({ summary: 'Get a playlist' })
  @ApiOkResponse({ type: Playlist, description: 'Playlist object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findPlaylistDTO: FindPlaylistDTO): Promise<Playlist> {
    const playlist: Playlist | undefined = await this.playlistsService.findOne(
      findPlaylistDTO,
    );

    if (!playlist) {
      throw new NotFoundException();
    }

    return playlist;
  }

  @ApiOperation({ summary: "Get a playlist's tracks" })
  @ApiOkResponse({ type: [Track], description: 'Track objects' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/tracks')
  async findTracks(
    @Param() findPlaylistDTO: FindPlaylistDTO,
  ): Promise<Track[]> {
    const playlist: Playlist | undefined = await this.playlistsService.findOne(
      findPlaylistDTO,
    );

    if (!playlist) {
      throw new NotFoundException();
    }

    playlist.tracks = await Promise.all(
      playlist.tracks.map(
        async (track): Promise<Track> => {
          // eslint-disable-next-line no-param-reassign
          track.listeningCount = await this.listeningsService.countForTrack(
            track,
          );
          return track;
        },
      ),
    );

    return playlist.tracks;
  }

  @ApiOperation({ summary: 'Update a playlist' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePlaylistAPIBody })
  @ApiOkResponse({ type: Playlist, description: 'Playlist object' })
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
  @UseInterceptors(FileInterceptor('cover_file'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findPlaylistDTO: FindPlaylistDTO,
    @Body() playlistData: UpdatePlaylistDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Playlist> {
    const existingPlaylist = await this.playlistsService.findOne(
      findPlaylistDTO,
    );

    if (!existingPlaylist) {
      throw new BadRequestException('Could not find playlist');
    }

    if (existingPlaylist.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    let tracks: string[] | null;
    if (playlistData.tracks) {
      tracks = JSON.parse(playlistData.tracks);
    } else {
      tracks = null;
    }
    // eslint-disable-next-line no-param-reassign
    delete playlistData.tracks;

    await this.playlistsService.update(
      findPlaylistDTO,
      playlistData,
      existingPlaylist,
      coverFile,
      tracks,
    );

    // Fetch updated playlist
    const updatedPlaylist = await this.playlistsService.findOne(
      findPlaylistDTO,
    );

    if (!updatedPlaylist) {
      throw new BadRequestException('Could not find playlist');
    }

    return updatedPlaylist;
  }

  @ApiOperation({ summary: 'Delete playlist' })
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
    @Param() playlist: FindPlaylistDTO,
  ): Promise<void> {
    const playlistToDelete = await this.playlistsService.findOne(playlist);

    if (playlistToDelete?.user.id !== req.user.id) {
      throw new ForbiddenException(['You do not own this playlist.']);
    }

    await this.playlistsService.delete(playlist);
  }
}
