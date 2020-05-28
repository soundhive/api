import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersRepository.save(createUserDTO);
  }

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(user: FindUserDTO): Promise<User> {
    return this.usersRepository.findOne({ username: user.username })
  }
}
