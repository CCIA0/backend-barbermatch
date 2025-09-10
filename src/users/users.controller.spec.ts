import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findMe: jest.fn(),
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'client',
    profile: {
      id: 1,
      name: 'Test User',
      stylePreferences: 'casual',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the current user', async () => {
      mockUsersService.findMe.mockResolvedValue(mockUser);

      const result = await controller.getMe(1);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findMe).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findMe.mockResolvedValue(null);

      await expect(controller.getMe(1)).rejects.toThrow('User not found');
    });
  });

  describe('getById', () => {
    it('should return user by id', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getById(1);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.getById(1)).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateDto = {
        name: 'Updated Name',
        stylePreferences: 'modern',
      };

      const updatedProfile = {
        ...mockUser.profile,
        ...updateDto,
      };

      mockUsersService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile(1, updateDto);

      expect(result).toEqual(updatedProfile);
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if profile not found', async () => {
      const updateDto = {
        name: 'Updated Name',
      };

      mockUsersService.updateProfile.mockResolvedValue(null);

      await expect(controller.updateProfile(1, updateDto)).rejects.toThrow('Profile not found');
    });
  });
});
