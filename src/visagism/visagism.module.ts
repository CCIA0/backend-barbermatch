import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisagismService } from './visagism.service';
import { VisagismController } from './visagism.controller';
import { FaceAnalysisResult } from '../entities/face-analysis-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaceAnalysisResult])],
  providers: [VisagismService],
  controllers: [VisagismController],
})
export class VisagismModule {}
