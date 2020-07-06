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
    UploadedFile,
    UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
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
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('trackFile'))
    async create(
        @Request() req: { user: AuthenticatedUserDTO },
        @Body() createTrackDTO: CreateTrackDTO,
        @UploadedFile() file: BufferedFile,
    ): Promise<Track> {
        if (!file) {
            throw new BadRequestException('Missing track file');
        }

        if (
            ![
                'audio/flac',
                'audio/mpeg',
                'audio/ogg',
                'audio/wav',
                'audio/wave',
            ].includes(file.mimetype)
        ) {
            throw new BadRequestException(
                `Invalid track file media type: ${file.mimetype}`,
            );
        }

        const user = await this.usersService.findOne(req.user);

        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }

        const album = await this.albumsService.findOne({
            id: createTrackDTO.album,
        });

        if (!album) {
            throw new BadRequestException('Invalid album');
        }

        const filename: string = await this.tracksService.uploadTrackFile(
            file,
            'tracks',
        );

        return new Track(
            await this.tracksService.create({
                ...createTrackDTO,
                downloadable: createTrackDTO.downloadable === 'true',
                user,
                album,
                filename,
            }),
        );
    }

    @Get()
    async find(): Promise<Track[]> {
        return this.tracksService.find();
    }

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

    @Get(':id/stats/last/:count/:period')
    async findLastStats(
        @Param() findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO,
    ): Promise<TrackListeningsResponseDTO> {
        return this.listeningsService.findLastForTrack(
            findLastListeningsForTrackDTO,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param() findTrackDTO: FindTrackDTO,
        @Body() trackData: UpdateTrackDTO,
    ): Promise<Track> {
        const result: UpdateResult = await this.tracksService.update(
            findTrackDTO,
            trackData,
        );

        if (!result.affected || result.affected === 0) {
            throw BadRequestException;
        }

        const track: Track | undefined = await this.tracksService.findOne(
            findTrackDTO,
        );

        if (!track) {
            throw BadRequestException;
        }

        return track;
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/listen')
    async listen(
        @Param() findTrackDTO: FindTrackDTO,
        @Request() req: { user: AuthenticatedUserDTO },
    ): Promise<void> {
        const user = await this.usersService.findOne(req.user);
        const track = await this.tracksService.findOne(findTrackDTO);
        const listening = new Listening({ user, track });
        await this.listeningsService.create(listening);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param() track: FindTrackDTO): Promise<void> {
        await this.tracksService.delete(track);
    }
}
