import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HairstylesService } from './hairstyles.service';
import { Hairstyle } from '../entities/hairstyle.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('HairstylesService', () => {
  let service: HairstylesService;
  let hairstyleRepository: MockRepository<Hairstyle>;

  const mockHairstyle: Hairstyle = {
    id: 1,
    name: 'Classic Cut',
    description: 'A timeless haircut.',
    imageUrl: 'image.url',
    recommendedFaceShapes: ['oval', 'square'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HairstylesService,
        {
          provide: getRepositoryToken(Hairstyle),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<HairstylesService>(HairstylesService);
    hairstyleRepository = module.get(getRepositoryToken(Hairstyle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new hairstyle', async () => {
      const hairstyleData = { name: 'New Style' };
      hairstyleRepository.create.mockReturnValue(hairstyleData as any);
      hairstyleRepository.save.mockResolvedValue(mockHairstyle);

      const result = await service.create(hairstyleData);

      expect(hairstyleRepository.create).toHaveBeenCalledWith(hairstyleData);
      expect(hairstyleRepository.save).toHaveBeenCalledWith(hairstyleData);
      expect(result).toEqual(mockHairstyle);
    });
  });

  describe('findAll', () => {
    it('should return an array of hairstyles', async () => {
      const hairstyles = [mockHairstyle];
      hairstyleRepository.find.mockResolvedValue(hairstyles);

      const result = await service.findAll();

      expect(result).toEqual(hairstyles);
      expect(hairstyleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByFaceShape', () => {
    it('should return hairstyles for a given face shape', async () => {
      const hairstyles = [mockHairstyle];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(hairstyles),
      };
      hairstyleRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.findByFaceShape('oval');

      expect(hairstyleRepository.createQueryBuilder).toHaveBeenCalledWith(
        'hairstyle',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        ':faceShape = ANY(hairstyle.recommendedFaceShapes)',
        { faceShape: 'oval' },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(hairstyles);
    });
  });
});
