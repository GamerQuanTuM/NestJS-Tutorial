import { Body, Controller, Delete, Get, Patch, Param, Post, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { Role, Task, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { StatusTaskType } from './task-status.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/admin.decorator';
import { RolesGuard } from 'src/auth/admin.guard';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController')
    constructor(private readonly tasksService: TasksService) { }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    getAllUsers() {
        return this.tasksService.getAllTasks();
    }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        if (Object.keys(filterDto).length) {
            this.logger.verbose(`User ${user.username} all tasks. filters: ${JSON.stringify(filterDto)}.`)
            return this.tasksService.getTasksWithFilter(filterDto, user)
        } else {
            this.logger.verbose(`User ${user.username} all tasks.`)
            return this.tasksService.getTasks(user)

        }
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating a new task.Data: ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user)
    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Delete(':id')
    deleteTaskById(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<string> {
        return this.tasksService.deleteTaskById(id, user)
    }

    @Patch(":id")
    updateTask(@Param("id", ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: StatusTaskType, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTask(status, id, user)
    }

}
