import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const newUser: User = new User(createUserDTO);
    const createdUser = await this.usersService.create(newUser);
    return createdUser;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // findAll() {
  //   return this.usersService.find();
  // }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Put(':id')
  // update(@Param('id') id: string, @Body() userDto: UserDto) {
  //   return this.usersService.updateUser(id, userDto);
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.softDelete(id);
  // }
}
