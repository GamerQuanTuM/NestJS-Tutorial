/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', role: 'ADMIN' },
    {
      id: 2,
      name: 'Charles Smith',
      email: 'charles_smith@gmail.com',
      role: 'DEVELOPER',
    },
    {
      id: 3,
      name: 'Erwin Howell',
      email: 'howeller68@gmail.com',
      role: 'INTERN',
    },
    {
      id: 4,
      name: 'Christopher Benjamin',
      email: 'ben_christopher@gmail.com',
      role: 'INTERN',
    },
    {
      id: 5,
      name: 'Leane Graham',
      email: 'graham789@gmail.com',
      role: 'ADMIN',
    },
    {
      id: 6,
      name: 'Natalya Christian',
      email: 'princessChristian@gmail.com',
      role: 'DEVELOPER',
    },
  ];

  findAll(role?: 'INTERN' | 'DEVELOPER' | 'ADMIN') {
    if (role) {
      const rolesArray = this.users.filter((user) => user.role === role);
      if (rolesArray.length === 0) {
        throw new NotFoundException('User Role Not Found');
      } else {
        return rolesArray;
      }
    }

    return this.users;
  }
  findOne(id: number) {
    const user = this.users.find((item) => item.id === id);
    if (!user) throw new NotFoundException(`No User find with this ${id} id`);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const userWithSameEmail = this.users.find(
      (existingUser) => existingUser.email === createUserDto.email,
    );

    if (userWithSameEmail) {
      throw new Error('User with the same email already exists');
    }
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = { ...createUserDto, id: usersByHighestId[0]?.id + 1 };
    return this.users.push(newUser);
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.findOne(id);
  }

  deleteOne(id: number) {
    const removedUser = this.findOne(id);

    this.users = this.users.filter((user) => user.id != id);

    return removedUser;
  }
}
