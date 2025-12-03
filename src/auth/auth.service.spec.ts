/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, CreateUserDto } from './interfaces/auth.interface';
import { AuthService } from './auth.service';
import { UserProfile } from '../entities/user-profile.entity';
import { User } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

type MockRepository<T = any> = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: MockRepository<User>;
  let jwtService: JwtService;
  let moduleRef: any;

  const mockProfile = new UserProfile();
  mockProfile.id = 1;
  mockProfile.name = 'Test User';
  mockProfile.stylePreferences = 'casual';

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    role: UserRole.CLIENT,
    profile: mockProfile,
    appointments: [],
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    service = moduleRef.get(AuthService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
    jwtService = moduleRef.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user and token for valid credentials', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(true);

      const { password, ...userWithoutPassword } = mockUser;
      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        user: userWithoutPassword,
        token: 'test_token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
        role: 'client',
      });
    });

    it('should return null for invalid password', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.validateUser(
        'nouser@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException when validation fails', async () => {
      usersRepository.findOne.mockRejectedValue(new Error('Database error'));
      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow('Error validating user');
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password,
        role: UserRole.CLIENT,
      };

      const userData = { ...createUserDto, password: hashedPassword };
      usersRepository.create.mockReturnValue(userData as any);
      usersRepository.save.mockResolvedValue({ id: 2, ...userData } as any);

      const result = await service.register(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(usersRepository.create).toHaveBeenCalledWith(userData);
      expect(usersRepository.save).toHaveBeenCalledWith(userData);
      expect(result.user).toHaveProperty('id', 2);
    });

    it('should throw ConflictException if email exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        role: UserRole.CLIENT,
      };

      usersRepository.findOne.mockResolvedValue(mockUser); // Simular usuario existente

      await expect(service.register(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        role: UserRole.CLIENT,
      };

      usersRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.register(createUserDto)).rejects.toThrow(
        'Error registering user',
      );
    });
  });
});
