import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number, select?: (keyof User)[]): Promise<User | null> {
    return this.usersRepository.findOneOrFail({ where: { id }, select });
  }

  findOneByEmail(email: string, select?: (keyof User)[]): Promise<User | null> {
    return this.usersRepository.findOneOrFail({ where: { email }, select });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(createUserDto.password, saltRounds);
    user.password = hashedPassword;
    
    user.created_at = new Date();
    user.updated_at = new Date();

    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    user.username = updateUserDto.username;
    user.updated_at = new Date();
    return this.usersRepository.save(user);
  }


  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}