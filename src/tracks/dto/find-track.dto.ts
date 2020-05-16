import { IsUUID } from "class-validator";
import { Exists } from "../../validators/exists.validation"
import { Track } from "../track.entity";

export class FindTrackDTO {
    @IsUUID('all')
    @Exists(Track)
    id: string
}
