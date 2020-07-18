import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ListeningsService } from 'src/listenings/listenings.service';
import { AudioFileMediaType } from 'src/media-types';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { FindTrackDTO } from './dto/find-track.dto';
import { InsertTrackDTO } from './dto/insert-track.dto';
import { InsertUpdatedTrackDTO } from './dto/insert-updated-track.dto';
import { Track } from './track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private tracksRepository: Repository<Track>,
    private minioClientService: MinioClientService,
    @Inject(forwardRef(() => ListeningsService))
    private listeningsService: ListeningsService,
  ) {}

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Track> | FindManyOptions<Track>,
  ): Promise<Pagination<Track>> {
    return paginate<Track>(this.tracksRepository, options, searchOptions);
  }

  async getChartingTracks(): Promise<Track[]> {
    const trackids = await this.listeningsService.getChartingTrackIdsWithListeningCount();

    const trackListeningMap = new Map(
      trackids.map((i) => [i.trackId, i.listeningcount] as [string, string]),
    );

    const trackList = trackids.map((element) => element.trackId);

    let tracks = await this.tracksRepository.findByIds(trackList);

    tracks = tracks.map(
      (track): Track => {
        // eslint-disable-next-line no-param-reassign
        track.listeningCount = Number(trackListeningMap.get(track.id));
        return track;
      },
    );

    tracks.sort((a, b) => {
      if (a.listeningCount && b.listeningCount) {
        return a.listeningCount < b.listeningCount ? 1 : -1;
      }
      return 0;
    });

    return tracks;
  }

  async create(
    insertTrackDTO: InsertTrackDTO,
    trackFile: BufferedFile,
  ): Promise<Track> {
    const track = new Track(insertTrackDTO);
    track.filename = await this.uploadTrackFile(trackFile);

    track.duration = await this.getTrackDuration(track);

    return this.tracksRepository.save(track);
  }

  async getTrackDuration(track: Track): Promise<number> {
    const trackFilePath = `/tmp/soundhive/${track.filename}`;
    await this.minioClientService.download(trackFilePath, track.filename);
    const duration = Math.round(await getAudioDurationInSeconds(trackFilePath));
    fs.unlinkSync(trackFilePath);

    return duration;
  }

  async find(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findBy(params: {}): Promise<Track[]> {
    return this.tracksRepository.find(params);
  }

  async findOne(track: FindTrackDTO): Promise<Track | undefined> {
    return this.tracksRepository.findOne({ id: track.id });
  }

  async update(
    track: FindTrackDTO,
    trackData: InsertUpdatedTrackDTO,
    existingTrack: Track,
    trackFile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (trackFile) {
      // Uplodad new track
      const filename = await this.uploadTrackFile(trackFile);
      // Delete old track file
      this.minioClientService.delete(existingTrack.filename);

      return this.tracksRepository.update(
        { id: track.id },
        { ...trackData, filename },
      );
    }

    return this.tracksRepository.update({ id: track.id }, trackData);
  }

  async delete(trackDTO: FindTrackDTO): Promise<DeleteResult> {
    const track = await this.tracksRepository.findOne(trackDTO);

    if (!track) {
      throw new NotFoundException('Could not find track');
    }

    const listenings = await this.listeningsService.findBy({ track });

    for (const listening of listenings) {
      await this.listeningsService.delete(listening);
    }

    this.minioClientService.delete(track.filename);
    return this.tracksRepository.delete(track.id);
  }

  async uploadTrackFile(file: BufferedFile): Promise<string> {
    if (!Object.values(AudioFileMediaType).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid track file media type: ${file.mimetype}`,
      );
    }

    const subFolder = 'tracks';

    const uploadedTrackFile = await this.minioClientService.upload(
      file,
      subFolder,
    );

    return uploadedTrackFile.path;
  }
}
