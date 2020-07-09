import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { User } from './user.entity';
import { FindUserDTO } from './dto/find-user.dto';
import { InsertUserDTO } from './dto/insert-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private minioClientService: MinioClientService,
  ) {}

  async create(user: InsertUserDTO): Promise<User> {
    return this.usersRepository.save(user);
  }

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(user: FindUserDTO): Promise<User | undefined> {
    return this.usersRepository.findOne({ username: user.username });
  }

  async uploadProfilePicture(
    file: BufferedFile,
    subFolder: string,
  ): Promise<string> {
    if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid profile picture image format: ${file.mimetype}`,
      );
    }

    const uploadedProfilePicture = await this.minioClientService.upload(
      file,
      subFolder,
    );

    return uploadedProfilePicture.path;
  }

  async update(
    user: FindUserDTO,
    userData: UpdateUserDTO,
  ): Promise<UpdateResult> {
    return this.usersRepository.update({ username: user.username }, userData);
  }
}
