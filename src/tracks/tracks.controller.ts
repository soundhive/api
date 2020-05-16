import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDTO } from './dto/create-track.dto';
import { Track } from './track.entity';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Post()
  async create(@Body() track: CreateTrackDTO): Promise<Track> {
    return await this.tracksService.create(new Track(track));
  }

  @Get()
  async find(): Promise<Track[]> {
    return this.tracksService.find();
  }

  @Get(':id')
  async findOne(@Param() tracl: FindTrackDTO): Promise<Track> {
    return await this.tracksService.findOne(tracl);
  }

  @Put(':id')
  async update(@Param() track: FindTrackDTO, @Body() trackData: UpdateTrackDTO): Promise<Track> {
    await this.tracksService.update(track, trackData);
    return await this.tracksService.findOne(track);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTrack(@Param() track: FindTrackDTO): void {
    this.tracksService.delete(track);
  }
}
