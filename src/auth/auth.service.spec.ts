
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: MockRepository<User>;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'client',
    profile: null,
    appointments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user and token for valid credentials', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const { password, ...userWithoutPassword } = mockUser;
      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({ user: userWithoutPassword, access_token: 'test_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'test@example.com', role: 'client' });
    });

    it('should return null for invalid password', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.validateUser('nouser@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const userData = { email: 'new@example.com', password: hashedPassword, role: 'client' };
      usersRepository.create.mockReturnValue(userData as any);
      usersRepository.save.mockResolvedValue({ id: 2, ...userData } as any);

      const result = await service.register('new@example.com', password, 'client');

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(usersRepository.create).toHaveBeenCalledWith(userData);
      expect(usersRepository.save).toHaveBeenCalledWith(userData);
      expect(result).toHaveProperty('id', 2);
    });
  });
});
