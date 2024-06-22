import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }


        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user || !roles.includes(user.role)) {
            throw new UnauthorizedException('You are not authorized to access this resource.');
        }
        return roles.includes(user.role);
    }
}
