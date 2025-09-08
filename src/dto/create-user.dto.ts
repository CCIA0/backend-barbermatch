import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['client', 'barber', 'admin'])
  role: 'client' | 'barber' | 'admin';
}
