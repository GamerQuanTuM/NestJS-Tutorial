/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly dataService: DatabaseService) {}

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.dataService.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role)
      return this.dataService.employee.findMany({
        where: {
          role,
        },
      });
    return this.dataService.employee.findMany();
  }

  async findOne(id: number) {
    return this.dataService.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.dataService.employee.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    return this.dataService.employee.delete({
      where: {
        id,
      },
    });
  }
}
