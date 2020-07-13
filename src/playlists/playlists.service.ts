import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { TracksService } from 'src/tracks/tracks.service';
import { isUUID } from 'class-validator';
import { Playlist } from './playlists.entity';
import { InsertPlaylistDTO } from './dto/insert-playlist.dto';
import { FindPlaylistDTO } from './dto/find-playlist.dto';
import { InsertUpdatedPlaylistDTO } from './dto/inset-updated-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    private minioClientService: MinioClientService,
    private tracksService: TracksService,
  ) {}

  async create(
    insertPlaylistDTO: InsertPlaylistDTO,
    coverFile: BufferedFile,
    tracks: string[],
  ): Promise<Playlist> {
    const playlist = new Playlist(insertPlaylistDTO);
    playlist.coverFilename = await this.uploadFileCover(coverFile);

    playlist.tracks = [];
    for (const trackID of tracks) {
      if (!isUUID(trackID)) {
        throw new BadRequestException(`Invalid track id: ${trackID}`);
      }
      const track = await this.tracksService.findOne({ id: trackID });
      if (!track) {
        throw new BadRequestException(`Could not find track: ${trackID}`);
      }
      playlist.tracks.push(track);
    }

    return new Playlist(await this.playlistsRepository.save(playlist));
  }

  async uploadFileCover(file: BufferedFile): Promise<string> {
    if (!Object.values(ImageFileMediaTypes).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid cover_file media type: ${file.mimetype}`,
      );
    }

    const subFolder = 'playlists';

    const uploadedImage = await this.minioClientService.upload(file, subFolder);

    return uploadedImage.path;
  }

  async find(): Promise<Playlist[]> {
    return this.playlistsRepository.find();
  }

  async findOne(playlist: FindPlaylistDTO): Promise<Playlist | undefined> {
    return this.playlistsRepository.findOne({ id: playlist.id });
  }

  async findBy(params: {}): Promise<Playlist[]> {
    return this.playlistsRepository.find(params);
  }

  async update(
    playlist: FindPlaylistDTO,
    playlistData: InsertUpdatedPlaylistDTO,
    existingPlaylist: Playlist,
    coverFile?: BufferedFile,
    tracks?: string[] | null,
  ): Promise<Playlist> {
    const updatedPlaylist = new Playlist({
      ...existingPlaylist,
      ...playlistData,
    });

    if (coverFile) {
      // Uplodad new playlist cover
      updatedPlaylist.coverFilename = await this.uploadFileCover(coverFile);
      // Delete old playlist cover file
      this.minioClientService.delete(existingPlaylist.coverFilename);
    }

    if (tracks) {
      updatedPlaylist.tracks = [];
      for (const trackID of tracks) {
        if (!isUUID(trackID)) {
          throw new BadRequestException(`Invalid track id: ${trackID}`);
        }
        const track = await this.tracksService.findOne({ id: trackID });
        if (!track) {
          throw new BadRequestException(`Could not find track: ${trackID}`);
        }
        updatedPlaylist.tracks.push(track);
      }
    }

    return this.playlistsRepository.save(updatedPlaylist);
  }

  async delete(playlistDTO: FindPlaylistDTO): Promise<DeleteResult> {
    const playlist = await this.playlistsRepository.findOne(playlistDTO);

    if (!playlist) {
      throw new BadRequestException();
    }

    this.minioClientService.delete(playlist.coverFilename);
    return this.playlistsRepository.delete(playlist.id);
  }
}
