import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDTO } from './dto/create-track.dto';
import { Track } from './track.entity';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  addTrack(@Body() createTrackDTO: CreateTrackDTO) {
    return this.tracksService.insertTrack(createTrackDTO);
  }

  @Get()
  getAllTracks() {
    return this.tracksService.getAllTracks();
  }

  @Get(':id')
  getTrack(@Param('id') trackId: string) {
    return this.tracksService.getTrack(trackId);
  }

  @Put(':id')
  @HttpCode(204)
  updateTrack(@Param('id') id, @Body() trackData: Track) {
    return this.tracksService.updateTrack(id, trackData);
  }

  @Delete(':id')
  @HttpCode(200)
  deleteTrack(@Param('id') trackId: string) {
    this.tracksService.deleteTrack(trackId).then();

    return null;
  }

  // TODO: findTrack() private method to handle track Not Found
}
