import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { VisagismService } from './visagism.service';
import { AnalyzeImageDto } from './dto/analyze-image.dto';

@Controller('visagism')
export class VisagismController {
  constructor(private readonly visagismService: VisagismService) {}

  @Post('analyze')
  async analyze(@Body(ValidationPipe) body: AnalyzeImageDto) {
    try {
      return await this.visagismService.analyzeImage(body.image);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error analyzing face image');
    }
  }
}
