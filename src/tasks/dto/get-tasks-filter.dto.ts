import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StatusTask, StatusTaskType } from "../task-status.enum";

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([StatusTask.DONE, StatusTask.OPEN, StatusTask.IN_PROGRESS])
    status: StatusTaskType;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    searchTerm: string;
}