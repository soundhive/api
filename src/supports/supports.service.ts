import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";
import { Support } from 'src/supports/support.entity'
import { CreateSupportDTO } from "./dto/create-support-dto";
import { DeleteSupportDTO } from "./dto/delete-support.dto"
import { UserSupportsResponseDTO } from "./dto/responses/user-supports-response.dto"
import { FindSupportsUserDTO } from "./dto/find-supports.user.dto"
import { User } from "src/users/user.entity";

@Injectable()
export class SupportsService {
    constructor(
        @InjectRepository(Support) 
        private supportRepository: Repository<Support>,
        ) {}

    async create(createSupportDTO: CreateSupportDTO): Promise<Support> {
        const existingSupport: Support | undefined = await this.supportRepository.findOne({ from: createSupportDTO.from, to: createSupportDTO.to });
        if (!existingSupport) {
            return this.supportRepository.save(createSupportDTO)
        }

        return existingSupport
    }

    async delete(deleteSupportDTO: DeleteSupportDTO): Promise<DeleteResult> {
        return this.supportRepository.delete(deleteSupportDTO)
    }

    async findUserSupported(findSupportsUserDTO : FindSupportsUserDTO) : Promise<UserSupportsResponseDTO> {
        let supports : Support[]  = await  this.supportRepository.find({from : findSupportsUserDTO})
        let users : User[] =  supports.map(e =>  e.to)
        return {number: users.length, users: users}

    }

    async findUserSupporters(findSupportsUserDTO : FindSupportsUserDTO) : Promise<UserSupportsResponseDTO> {
        let supports : Support[]  = await  this.supportRepository.find({to : findSupportsUserDTO})
        let users : User[] =  supports.map(e =>  e.from)
        return {number: users.length, users: users}

    }

    //async findUserSupporteds
}
