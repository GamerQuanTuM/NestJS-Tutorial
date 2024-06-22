import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prismadb: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "topSecret51",
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id, username } = payload

        const user = this.prismadb.user.findFirst({
            where: {
                id,
                username
            }
        })

        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        return user
    }
}