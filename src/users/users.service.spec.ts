import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let profilesRepository: MockRepository<UserProfile>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'password',
    role: 'client',
    profile: {
      id: 1,
      name: 'Test User',
      stylePreferences: 'Short hair',
      user: null, 
    },
    appointments: [],
  };

  const mockUserProfile: UserProfile = {
    id: 1,
    name: 'Test User',
    stylePreferences: 'Short hair',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(UserProfile),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    profilesRepository = module.get(getRepositoryToken(UserProfile));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMe', () => {
    it('should return a user with profile', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findMe(1);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['profile'],
      });
    });

    it('should return null if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.findMe(1);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user with profile', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['profile'],
      });
    });

    it('should return null if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.findById(1);
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user profile', async () => {
      const updatedProfileData = { name: 'Updated Name' };
      const updatedProfile = { ...mockUserProfile, ...updatedProfileData };

      profilesRepository.findOne.mockResolvedValue(mockUserProfile);
      profilesRepository.save.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile(1, updatedProfileData);

      expect(profilesRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
      });
      expect(profilesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedProfileData),
      );
      expect(result).toEqual(updatedProfile);
    });

    it('should return null if profile not found', async () => {
      profilesRepository.findOne.mockResolvedValue(null);
      const result = await service.updateProfile(1, { name: 'New Name' });
      expect(result).toBeNull();
      expect(profilesRepository.save).not.toHaveBeenCalled();
    });
  });
});