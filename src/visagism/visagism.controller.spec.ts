import { Test, TestingModule } from '@nestjs/testing';
import { VisagismController } from './visagism.controller';
import { VisagismService } from './visagism.service';

describe('VisagismController', () => {
  let controller: VisagismController;
  let visagismService: VisagismService;

  const mockVisagismService = {
    analyzeImage: jest.fn(),
  };

  const mockAnalysisResult = {
    faceShape: 'oval',
    confidence: 0.95,
    recommendations: [
      {
        id: 1,
        name: 'Classic Short',
        score: 0.9,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisagismController],
      providers: [
        {
          provide: VisagismService,
          useValue: mockVisagismService,
        },
      ],
    }).compile();

    controller = module.get<VisagismController>(VisagismController);
    visagismService = module.get<VisagismService>(VisagismService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyze', () => {
    it('should analyze face image and return recommendations', async () => {
      const imageData = {
        image: 'base64_encoded_image_data',
      };

      mockVisagismService.analyzeImage.mockResolvedValue(mockAnalysisResult);

      const result = await controller.analyze(imageData);

      expect(result).toEqual(mockAnalysisResult);
      expect(mockVisagismService.analyzeImage).toHaveBeenCalledWith(
        imageData.image,
      );
    });

    it('should handle analysis errors', async () => {
      const imageData = {
        image: 'invalid_image_data',
      };

      mockVisagismService.analyzeImage.mockRejectedValue(
        new Error('Invalid image data'),
      );

      await expect(controller.analyze(imageData)).rejects.toThrow(
        'Invalid image data',
      );
    });

    it('should validate input data', async () => {
      const invalidData = {};

      await expect(controller.analyze(invalidData as any)).rejects.toThrow();
    });
  });
});
