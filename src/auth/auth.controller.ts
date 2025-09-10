import { Controller, Post, Body, UnauthorizedException, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, AuthResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: { email: string; password: string }
  ): Promise<AuthResponse> {
    const result = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }
}
