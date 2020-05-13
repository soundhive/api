import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDTO: CreateUserDTO) {
    const duplicateUsers = await this.usersRepository.find({
      where: [
        { username: createUserDTO.username },
      ]
    });

    if (duplicateUsers.length > 0) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST)
    } else {
      return this.usersRepository.save(createUserDTO);
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({ username: username });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
