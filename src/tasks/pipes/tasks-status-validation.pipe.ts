import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { StatusTask } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        StatusTask.OPEN,
        StatusTask.DONE,
        StatusTask.IN_PROGRESS
    ]
    private isStatusValid(status: any) {
        const idx = this.allowedStatus.indexOf(status);
        return idx != -1
    }
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase()

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }

        return value
    }


}