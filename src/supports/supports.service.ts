import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";
import { Support } from 'src/supports/support.entity'
import { User } from "src/users/user.entity";
import { CreateSupportDTO } from "./dto/create-support-dto";
import { DeleteSupportDTO } from "./dto/delete-support.dto"
import { FindSupportsUserDTO } from "./dto/find-supports.user.dto"

@Injectable()
export class SupportsService {
    constructor(
        @InjectRepository(Support)
        private supportRepository: Repository<Support>,
    ) { }

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

    async findUserSupported(findSupportsUserDTO: FindSupportsUserDTO): Promise<User[]> {
        const supports: Support[] = await this.supportRepository.find({ from: findSupportsUserDTO })

        return supports.map(e => e.to)
    }

    async findUserSupporters(findSupportsUserDTO: FindSupportsUserDTO): Promise<User[]> {
        const supports: Support[] = await this.supportRepository.find({ to: findSupportsUserDTO })

        return supports.map(e => e.from);
    }
}
