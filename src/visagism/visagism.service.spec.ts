import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisagismService } from './visagism.service';
import { FaceAnalysisResult } from '../entities/face-analysis-result.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('VisagismService', () => {
  let service: VisagismService;
  let analysisRepository: MockRepository<FaceAnalysisResult>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisagismService,
        {
          provide: getRepositoryToken(FaceAnalysisResult),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<VisagismService>(VisagismService);
    analysisRepository = module.get(getRepositoryToken(FaceAnalysisResult));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeImage', () => {
    it('should analyze an image and return the result', async () => {
      const imageData = 'test_image_data';
      const createdAnalysis = { faceShape: 'oval', confidence: 0.95 };
      const savedAnalysis = { id: 1, ...createdAnalysis };

      analysisRepository.create.mockReturnValue(createdAnalysis);
      analysisRepository.save.mockResolvedValue(savedAnalysis);

      const result = await service.analyzeImage(imageData);

      expect(analysisRepository.create).toHaveBeenCalledWith({
        faceShape: 'oval',
        confidence: 0.95,
      });
      expect(analysisRepository.save).toHaveBeenCalledWith(createdAnalysis);
      expect(result).toEqual(savedAnalysis);
    });
  });
});
