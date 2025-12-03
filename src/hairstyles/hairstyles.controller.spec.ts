import { Test, TestingModule } from '@nestjs/testing';
import { HairstylesController } from './hairstyles.controller';
import { HairstylesService } from './hairstyles.service';
import { CreateHairstyleDto } from '../dto/create-hairstyle.dto';

describe('HairstylesController', () => {
  let controller: HairstylesController;
  let hairstylesService: HairstylesService;

  const mockHairstylesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByFaceShape: jest.fn(),
  };

  const mockHairstyle = {
    id: 1,
    name: 'Classic Cut',
    description: 'A timeless style',
    imageUrl: 'https://example.com/image.jpg',
    recommendedFaceShapes: ['oval', 'round'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HairstylesController],
      providers: [
        {
          provide: HairstylesService,
          useValue: mockHairstylesService,
        },
      ],
    }).compile();

    controller = module
      .createNestApplication()
      .get<HairstylesController>(HairstylesController);
    hairstylesService = module
      .createNestApplication()
      .get<HairstylesService>(HairstylesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a hairstyle', async () => {
      const createHairstyleDto: CreateHairstyleDto = {
        name: 'Classic Cut',
        description: 'A timeless style',
        imageUrl: 'https://example.com/image.jpg',
        recommendedFaceShapes: ['oval', 'round'],
      };

      mockHairstylesService.create.mockResolvedValue(mockHairstyle);

      const result = await controller.create(createHairstyleDto);

      expect(result).toEqual(mockHairstyle);
      expect(mockHairstylesService.create).toHaveBeenCalledWith(
        createHairstyleDto,
      );
    });

    it('should throw an error if creation fails', async () => {
      const createHairstyleDto: CreateHairstyleDto = {
        name: 'Classic Cut',
        description: 'A timeless style',
        imageUrl: 'https://example.com/image.jpg',
        recommendedFaceShapes: ['oval', 'round'],
      };

      mockHairstylesService.create.mockRejectedValue(
        new Error('Failed to create hairstyle'),
      );

      await expect(controller.create(createHairstyleDto)).rejects.toThrow(
        'Failed to create hairstyle',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of hairstyles', async () => {
      mockHairstylesService.findAll.mockResolvedValue([mockHairstyle]);

      const result = await controller.findAll();

      expect(result).toEqual([mockHairstyle]);
      expect(mockHairstylesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByFaceShape', () => {
    it('should return hairstyles for a given face shape', async () => {
      mockHairstylesService.findByFaceShape.mockResolvedValue([mockHairstyle]);

      const result = await controller.findByFaceShape('oval');

      expect(result).toEqual([mockHairstyle]);
      expect(mockHairstylesService.findByFaceShape).toHaveBeenCalledWith(
        'oval',
      );
    });

    it('should return empty array for invalid face shape', async () => {
      mockHairstylesService.findByFaceShape.mockResolvedValue([]);

      const result = await controller.findByFaceShape('invalid');

      expect(result).toEqual([]);
      expect(mockHairstylesService.findByFaceShape).toHaveBeenCalledWith(
        'invalid',
      );
    });
  });
});
