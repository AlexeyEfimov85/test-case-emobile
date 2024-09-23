import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      ...createUserDto,
    });
    return this.usersRepository.save(user);
  }

  async seedDatawithFaker(): Promise<void> {
    const userData: User[] = [];
    const userCount = Number(String(process.env.USERS_QUANTITY));

    for (let i = 0; i < userCount; i++) {
      const id = i + 3;
      const gender = faker.person.sexType();
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName();
      const age = Math.floor(Math.random() * 100);
      const isProblem = i % 2 === 0 ? true : false;

      userData.push({ id, firstName, lastName, gender, age, isProblem });
    }

    try {
      await this.usersRepository.save(userData, { chunk: 1000 });
      Logger.log('Data seeded successfully');
    } catch (error) {
      Logger.error(`Error seeding data: ${error.message}`, error.stack);
    }
  }

  async getDataLength(): Promise<number> {
    const users = await this.usersRepository.find({
      where: [{ isProblem: true }],
    });
    return users.length;
  }

  async solveProblems(): Promise<number> {
    const amountWithProblems = await this.usersRepository.find({
      where: [{ isProblem: true }],
    });
    await this.usersRepository.update({}, { isProblem: false });
    return amountWithProblems.length;
  }
}
