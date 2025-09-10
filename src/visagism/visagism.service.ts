import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaceAnalysisResult } from '../entities/face-analysis-result.entity';
import { ImageAnalysisResult } from './interfaces/image-analysis-result.interface';

@Injectable()
export class VisagismService {
  constructor(
    @InjectRepository(FaceAnalysisResult)
    private analysisRepository: Repository<FaceAnalysisResult>,
  ) {}

  async analyzeImage(imageData: string): Promise<FaceAnalysisResult> {
    if (!imageData || typeof imageData !== 'string') {
      throw new BadRequestException('Invalid image data');
    }

    try {
      // Aquí iría la integración con ML Kit / MediaPipe
      const analysisResult: ImageAnalysisResult = {
        faceShape: 'oval',
        confidence: 0.95,
      };

      const result = this.analysisRepository.create({
        faceShape: analysisResult.faceShape,
        confidence: analysisResult.confidence,
      });

      return this.analysisRepository.save(result);
    } catch (error) {
      throw new BadRequestException('Failed to analyze image');
    }
  }
}
