import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Support } from 'src/supports/support.entity'
import { CreateSupportDTO } from "./dto/create-support-dto";

@Injectable()
export class SupportsService {
    constructor(@InjectRepository(Support) private supportRepository: Repository<Support>) {}

    async create(createSupportDTO: CreateSupportDTO): Promise<Support> {
        return this.supportRepository.save(createSupportDTO)
    }
    
}