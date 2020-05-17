import { CreateTrackDTO } from '../../tracks/dto/create-track.dto';

export class CreateAlbumDTO {
  title: string;
  description: string;
  coverFilename: string;
  tasks?: CreateTrackDTO[];
}
