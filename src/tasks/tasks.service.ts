import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusTask, StatusTaskType } from './task-status.enum';

@Injectable()
export class TasksService {
    private logger = new Logger()
    constructor(
        private prismadb: PrismaService
    ) { }

    async getAllTasks() {
        try {
            const tasks = await this.prismadb.task.findMany()
            return tasks
        } catch (error) {
            this.logger.error("Failed to get tasks", error.stack)
            throw new InternalServerErrorException()
        }

    }

    async getTasks(user: User): Promise<Task[]> {
        try {
            const tasks = await this.prismadb.task.findMany({
                where: {
                    userId: user.id
                }
            })
            return tasks
        } catch (error) {
            this.logger.error(`Failed to get tasks ${user.username}`, error.stack)
            throw new InternalServerErrorException()
        }

    }

    async getTasksWithFilter(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { searchTerm, status } = filterDto

        try {
            const tasks = this.prismadb.task.findMany({
                where: {
                    userId: user.id,
                    AND: [
                        status ? { status } : {},
                        searchTerm
                            ? {
                                OR: [
                                    {
                                        title: {
                                            contains: searchTerm,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        description: {
                                            contains: searchTerm,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            }
                            : {},
                    ],
                },
            })

            return tasks
        } catch (error) {
            this.logger.error(`Failed to get tasks ${user.username}. Filters: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException()
        }


    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        try {

            if (!user.id) {
                throw new BadRequestException('User id is missing')
            } else {
                const created = await this.prismadb.task.create({
                    data: {
                        title: createTaskDto.title,
                        description: createTaskDto.description,
                        status: StatusTask.OPEN,
                        userId: user.id
                    },
                })
                return created
            }

        } catch (error) {
            this.logger.error(`Failed to create tasks ${user.username}. Data: ${JSON.stringify(createTaskDto)}`, error.stack)
            throw new InternalServerErrorException()
        }


    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.prismadb.task.findFirst({
            where: {
                id,
                userId: user.id
            },
        });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async deleteTaskById(id: number, user: User): Promise<string> {
        const found = await this.getTaskById(id, user)
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        } else {
            await this.prismadb.task.delete({
                where: {
                    id
                }
            })
        }
        return `The Task is ${id} is deleted`;
    }

    async updateTask(status: StatusTaskType, id: number, user: User): Promise<Task> {
        const found = await this.getTaskById(id, user)

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        } else {
            const updated = await this.prismadb.task.update({
                where: {
                    id: found.id
                },
                data: {
                    status
                }
            })
            return updated;
        }
    }
}
