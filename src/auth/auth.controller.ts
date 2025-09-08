import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: CreateUserDto) {
    return this.authService.register(body.email, body.password, body.role);
  }

  // Endpoint de login con JWT
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.validateUser(body.email, body.password);
  }
}
