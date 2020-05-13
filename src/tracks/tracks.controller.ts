import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDTO } from './dto/create-track.dto';

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
}
