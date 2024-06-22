import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Omit<User, 'password'> => {
        const request = ctx.switchToHttp().getRequest();
        const user: User = request.user;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
);