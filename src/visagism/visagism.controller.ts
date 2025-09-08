import { Controller, Post, Body } from '@nestjs/common';
import { VisagismService } from './visagism.service';

@Controller('visagism')
export class VisagismController {
  constructor(private readonly visagismService: VisagismService) {}

  @Post('analyze')
  async analyze(@Body() body: { image: any }) {
    return this.visagismService.analyzeImage(body.image);
  }
}
