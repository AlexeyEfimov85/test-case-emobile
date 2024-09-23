import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/seed')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get('seed/faker')
  async seedDatawithFaker(): Promise<string> {
    await this.usersService.seedDatawithFaker();
    return 'База данных заполнена тестовыми пользователями!';
  }

  @Get('data/length')
  async getDataLength(): Promise<string> {
    const length = await this.usersService.getDataLength();
    return `'База данных заполнена ${length} тестовыми пользователями!'`;
  }

  @Patch('solve/problems')
  async solveProblems(): Promise<number> {
    return await this.usersService.solveProblems();
  }
}
