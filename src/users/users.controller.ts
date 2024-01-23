/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

//Order matters in nest for making routes

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or /users?role=value&age=20
  findAll(@Query('role') role?: 'INTERN' | 'DEVELOPER' | 'ADMIN') {
    return this.usersService.findAll(role);
  }

  //Putting this after the param id req [findOne()] is wrong because it will read the endpoint interns as an id
  @Get('interns') // GET
  findAllInterns() {
    return [];
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post() // POST /users
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    this.usersService.create(createUserDto);
    const allUsers = this.usersService.findAll();
    return allUsers;
  }

  @Patch(':id') // PATCH /users/:id
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id);
  }
}
