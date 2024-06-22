import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4, { message: "Min length is 4" })
    @MaxLength(20, { message: "Max length is 20" })
    username: string;

    @MinLength(8, { message: "Min length is 8" })
    @MaxLength(20, { message: "Max length is 20" })
    @Matches((/((?=.*\d)|(?=.*\W))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*s/), {
        message: "Password too weak"
    })
    password: string;
}