/* eslint-disable no-param-reassign */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileMediaTypes } from 'src/media-types';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Repository } from 'typeorm';
import { FindUserDTO } from './dto/find-user.dto';
import { InsertUserDTO } from './dto/insert-user.dto';
import { User } from './user.entity';

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
    userData: Partial<User>,
    existingUser: User,
    profilePictureFile?: BufferedFile,
  ): Promise<User> {
    if (profilePictureFile) {
      // Uplodad new profile pic
      const profilePicture = await this.uploadProfilePicture(
        profilePictureFile,
      );
      // Delete old profile pic
      this.minioClientService.delete(existingUser.profilePicture);

      userData.profilePicture = profilePicture;
    }

    // We need to save existing entity instead of update(Partial<User>)
    // Otherwise the entity hooks won't be run (here, for password hashing)
    Object.keys(userData).forEach((key) => {
      existingUser[key] = userData[key];
    });
    return this.usersRepository.save(existingUser);
  }
}
