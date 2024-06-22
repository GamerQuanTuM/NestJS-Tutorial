import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/authcredentials-dto';

@Injectable()
export class AuthService {
    private logger = new Logger()
    constructor(private prismadb: PrismaService, private jwt: JwtService) { }

    private async hasPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    private async validatePassword(inputPassword: string, dbPassword: string) {
        return bcrypt.compare(inputPassword, dbPassword);
    }

    private async existingUser(username: string) {
        const exists = await this.prismadb.user.findFirst({
            where: {
                username,
            }
        })

        return exists
    }

    async signup(authCredentialsDto: AuthCredentialsDto): Promise<Omit<User, 'password' | 'role'>> {
        const { password, username } = authCredentialsDto;

        const exists = await this.existingUser(username)

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await this.hasPassword(password, salt);

        if (!exists) {
            const user = await this.prismadb.user.create({
                data: {
                    password: hashedPassword,
                    username
                },
                select: {
                    id: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                    task: true,
                }
            })
            return user
        } else {
            throw new ConflictException('Username exists')
        }
    }

    async signin(authCredentialsDto: AuthCredentialsDto) {
        const { password, username } = authCredentialsDto;

        const dbUser = await this.existingUser(username)

        if (dbUser) {
            const passwordMatch = await this.validatePassword(password, dbUser.password);
            if (passwordMatch) {
                const payload = { username: dbUser.username, id: dbUser.id };
                const accessToken = this.jwt.sign(payload)
                this.logger.debug(`Generated accessToken for user ${dbUser.username}`)
                const { password, ...userWithoutPassword } = dbUser;
                return { ...userWithoutPassword, accessToken }
            } else {
                throw new UnauthorizedException('Invalid credentials');
            }
        } else {
            throw new UnauthorizedException('User not found');
        }
    }
}
