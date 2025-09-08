import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaceAnalysisResult } from '../entities/face-analysis-result.entity';

@Injectable()
export class VisagismService {
  constructor(
    @InjectRepository(FaceAnalysisResult)
    private analysisRepository: Repository<FaceAnalysisResult>,
  ) {}

  async analyzeImage(imageData: any): Promise<FaceAnalysisResult> {
    // Aquí iría la integración con ML Kit / MediaPipe
    // Simulación de resultado
    const result = this.analysisRepository.create({
      faceShape: 'oval',
      confidence: 0.95,
    });
    return this.analysisRepository.save(result);
  }
}
