import { IsString, IsEmail, IsEnum } from 'class-validator';

export enum UserRole {
  CLIENT = 'client',
  BARBER = 'barber',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
  token: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
