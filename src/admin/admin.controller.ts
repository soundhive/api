import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { CreateAlbumAPIBody } from 'src/albums/dto/create-album-api-body.dto';
import { CreateAlbumDTO } from 'src/albums/dto/create-album.dto';
import { FindAlbumDTO } from 'src/albums/dto/find-album.dto';
import { UpdateAlbumAPIBody } from 'src/albums/dto/update-album-api-body.dto';
import { UpdateAlbumDTO } from 'src/albums/dto/update-album.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreatePlaylistAPIBody } from 'src/playlists/dto/create-playlist-api-body.dto';
import { CreatePlaylistDTO } from 'src/playlists/dto/create-playlist.dto';
import { FindPlaylistDTO } from 'src/playlists/dto/find-playlist.dto';
import { UpdatePlaylistAPIBody } from 'src/playlists/dto/update-playlist-api-body.dto';
import { UpdatePlaylistDTO } from 'src/playlists/dto/update-playlist.dto';
import { Playlist } from 'src/playlists/playlists.entity';
import { PlaylistsService } from 'src/playlists/playlists.service';
import { CreateSampleAPIBody } from 'src/samples/dto/create-sample-api-body.dto';
import { CreateSampleDTO } from 'src/samples/dto/create-sample.dto';
import { FindSampleDTO } from 'src/samples/dto/find-sample.dto';
import { UpdateSampleAPIBody } from 'src/samples/dto/update-sample-api-body.dto';
import { UpdateSampleDTO } from 'src/samples/dto/update-sample.dto';
import { Sample } from 'src/samples/samples.entity';
import { SamplesService } from 'src/samples/samples.service';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { CreateTrackAPIBody } from 'src/tracks/dto/create-track-api-body.dto';
import { CreateTrackDTO } from 'src/tracks/dto/create-track.dto';
import { FindTrackDTO } from 'src/tracks/dto/find-track.dto';
import { UpdateTrackAPIBody } from 'src/tracks/dto/update-track-api-body.dto';
import { UpdateTrackDTO } from 'src/tracks/dto/update-track.dto';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import FindUserDTO from 'src/users/dto/find-user.dto';
import { UpdateUserAPIBody } from 'src/users/dto/update-user-api-body';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateResult } from 'typeorm';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly playlistsService: PlaylistsService,
    private readonly samplesService: SamplesService,
  ) {}

  @ApiOperation({ summary: '[Admin] Post a album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAlbumAPIBody })
  @ApiCreatedResponse({ type: () => Album, description: 'Album object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('cover_file'))
  @Post('album')
  async createAlbum(
    @Request() req: ValidatedJWTReq,
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Album> {
    if (!coverFile) {
      throw new BadRequestException('Missing cover_file');
    }

    const album = await this.albumsService.create(
      {
        ...createAlbumDTO,
        user: req.user,
      },
      coverFile,
    );

    return new Album(album);
  }

  @ApiOperation({ summary: '[Admin] Update an album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAlbumAPIBody })
  @ApiOkResponse({ type: () => Album, description: 'Album object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('cover_file'))
  @Put('album/:id')
  async updateAlbum(
    @Request() req: ValidatedJWTReq,
    @Param() findAlbumDTO: FindAlbumDTO,
    @Body() albumData: UpdateAlbumDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Album> {
    const existingAlbum = await this.albumsService.findOne(findAlbumDTO);

    if (!existingAlbum) {
      throw new BadRequestException('Could not find album');
    }

    const result: UpdateResult = await this.albumsService.update(
      findAlbumDTO,
      albumData,
      existingAlbum,
      coverFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update album.');
    }

    // Fetch updated album
    const updatedAlbum = await this.albumsService.findOne(findAlbumDTO);

    if (!updatedAlbum) {
      throw new BadRequestException('Could not find album');
    }

    return updatedAlbum;
  }

  @ApiOperation({ summary: '[Admin] Delete album' })
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
  @UseGuards(AdminGuard)
  @HttpCode(204)
  @Delete('album/:id')
  async deleteAlbum(
    @Request() req: ValidatedJWTReq,
    @Param() album: FindAlbumDTO,
  ): Promise<void> {
    await this.albumsService.delete(album);
  }

  @ApiOperation({ summary: '[Admin] Create a playlist' })
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
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('cover_file'))
  @Post('playlist')
  async createPlaylist(
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

  @ApiOperation({ summary: '[Admin] Update a playlist' })
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
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('cover_file'))
  @Put('playlist/:id')
  async updatePlaylist(
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

  @ApiOperation({ summary: '[Admin] Delete playlist' })
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
  @UseGuards(AdminGuard)
  @HttpCode(204)
  @Delete('playlist/:id')
  async deletePlaylist(
    @Request() req: ValidatedJWTReq,
    @Param() playlist: FindPlaylistDTO,
  ): Promise<void> {
    await this.playlistsService.delete(playlist);
  }

  @ApiOperation({ summary: '[Admin] Create a sample' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSampleAPIBody })
  @ApiCreatedResponse({ type: Sample, description: 'Sample object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('sample_file'))
  @Post('sample')
  async createSample(
    @Request() req: ValidatedJWTReq,
    @Body() createSampleDTO: CreateSampleDTO,
    @UploadedFile() sampleFile: BufferedFile,
  ): Promise<Sample> {
    if (!sampleFile) {
      throw new BadRequestException('Missing sample file');
    }

    return new Sample(
      await this.samplesService.create(
        {
          ...createSampleDTO,
          user: req.user,
        },
        sampleFile,
      ),
    );
  }

  @ApiOperation({ summary: '[Admin] Update a sample' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSampleAPIBody })
  @ApiOkResponse({ type: Sample, description: 'Sample object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('sample_file'))
  @Put('sample/:id')
  async updateSample(
    @Request() req: ValidatedJWTReq,
    @Param() findSampleDTO: FindSampleDTO,
    @Body() sampleData: UpdateSampleDTO,
    @UploadedFile() sampleFile: BufferedFile,
  ): Promise<Sample> {
    const existingSample = await this.samplesService.findOne(findSampleDTO);

    if (!existingSample) {
      throw new BadRequestException('Could not find sample');
    }

    const result: UpdateResult = await this.samplesService.update(
      findSampleDTO,
      sampleData,
      existingSample,
      sampleFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update sample.');
    }

    // Fetch updated sample
    const updatedSample = await this.samplesService.findOne(findSampleDTO);

    if (!updatedSample) {
      throw new BadRequestException('Could not find sample');
    }

    return updatedSample;
  }

  @ApiOperation({ summary: '[Admin] Delete sample' })
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
  @UseGuards(AdminGuard)
  @HttpCode(204)
  @Delete('sample/:id')
  async deleteSample(
    @Request() req: ValidatedJWTReq,
    @Param() sample: FindSampleDTO,
  ): Promise<void> {
    await this.samplesService.delete(sample);
  }

  @ApiOperation({ summary: '[Admin] Post a track' })
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
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('track_file'))
  @Post('track')
  async createTrack(
    @Request() req: ValidatedJWTReq,
    @Body() createTrackDTO: CreateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    if (!trackFile) {
      throw new BadRequestException('Missing track file');
    }

    const album = await this.albumsService.findOne({
      id: createTrackDTO.album,
    });

    if (!album) {
      throw new BadRequestException('Invalid album');
    }

    return this.tracksService.create(
      {
        ...createTrackDTO,
        downloadable: createTrackDTO.downloadable === 'true',
        user: req.user,
        album,
      },
      trackFile,
    );
  }

  @ApiOperation({ summary: '[Admin] Update a track' })
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
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('track_file'))
  @Put('track/:id')
  async updateTrack(
    @Request() req: ValidatedJWTReq,
    @Param() findTrackDTO: FindTrackDTO,
    @Body() trackData: UpdateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    const existingTrack = await this.tracksService.findOne(findTrackDTO);

    if (!existingTrack) {
      throw new BadRequestException('Could not find track');
    }

    const result: UpdateResult = await this.tracksService.update(
      findTrackDTO,
      trackData,
      existingTrack,
      trackFile,
    );

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

  @ApiOperation({ summary: '[Admin] Delete track' })
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
  @UseGuards(AdminGuard)
  @HttpCode(204)
  @Delete('track/:id')
  async deleteTrack(
    @Request() req: ValidatedJWTReq,
    @Param() track: FindTrackDTO,
  ): Promise<void> {
    await this.tracksService.delete(track);
  }

  @ApiOperation({ summary: '[Admin] Update user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserAPIBody })
  @ApiOkResponse({ type: User, description: 'User object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Put('user/:username')
  async updateUser(
    @Request() req: ValidatedJWTReq,
    @Param() findUserDTO: FindUserDTO,
    @Body() userData: UpdateUserDTO,
    @UploadedFile() ProfilePictureFile: BufferedFile,
  ): Promise<User> {
    const existingUser = await this.usersService.findOne(findUserDTO);

    if (!existingUser) {
      throw new BadRequestException('Could not find user');
    }

    return this.usersService.update(userData, existingUser, ProfilePictureFile);
  }

  @ApiOperation({ summary: '[Admin] Delete user (WIP)' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete('user/:username')
  async deleteUser(): // @Request() req: ValidatedJWTReq,
  // @Param() findUserDTO: FindUserDTO,
  Promise<void> {
    // const existingUser = await this.usersService.findOne(findUserDTO);
    // existingUser.delete()
  }
}
