import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { User } from './user.entity';
import { FindUserDTO } from './dto/find-user.dto';
import { InsertUserDTO } from './dto/insert-user.dto';
import { InsertUpdatedUserDTO } from './dto/insert-updated-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private minioClientService: MinioClientService,
  ) {}

  async create(
    insertUserDTO: InsertUserDTO,
    profilePictureFile: BufferedFile,
  ): Promise<User> {
    const user = new User(insertUserDTO);
    user.profilePicture = await this.uploadProfilePicture(profilePictureFile);

    return this.usersRepository.save(user);
  }

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(user: FindUserDTO): Promise<User | undefined> {
    return this.usersRepository.findOne({ username: user.username });
  }

  async uploadProfilePicture(file: BufferedFile): Promise<string> {
    if (!Object.values(ImageFileMediaTypes).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid profile picture image format: ${file.mimetype}`,
      );
    }

    const subFolder = 'users/avatars';
    const uploadedProfilePicture = await this.minioClientService.upload(
      file,
      subFolder,
    );

    return uploadedProfilePicture.path;
  }

  async update(
    user: FindUserDTO,
    userData: InsertUpdatedUserDTO,
    existingUser: User,
    profilePictureFile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (profilePictureFile) {
      // Uplodad new profile pic
      const profilePicture = await this.uploadProfilePicture(
        profilePictureFile,
      );
      // Delete old profile pic
      this.minioClientService.delete(existingUser.profilePicture);

      return this.usersRepository.update(
        { username: user.username },
        { ...userData, profilePicture },
      );
    }
    return this.usersRepository.update({ username: user.username }, userData);
  }
}
