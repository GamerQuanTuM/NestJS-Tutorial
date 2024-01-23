/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'DEVELOPER', 'ADMIN'], {
    message: 'Valid role required',
  })
  role: 'INTERN' | 'DEVELOPER' | 'ADMIN';
}
