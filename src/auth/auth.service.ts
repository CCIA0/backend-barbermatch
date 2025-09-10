import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, AuthResponse, JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthResponse | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { user: result, token };
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Error validating user');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      });
      const savedUser = await this.usersRepository.save(user);
      
      const { password, ...result } = savedUser;
      const payload: JwtPayload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
      const token = this.jwtService.sign(payload);
      return { user: result, token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering user');
    }
  }
}
