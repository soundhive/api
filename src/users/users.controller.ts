import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService} from './users.service';

@Controller('users')
export class UserController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.create(createUserDTO);
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
