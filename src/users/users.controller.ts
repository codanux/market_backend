import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ConflictException } from '@nestjs/common';
import { Auth, Role } from 'src/auth/auth.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Role.Admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(Role.Admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    return this.usersService.create(createUserDto);
  }

  @Auth(Role.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
