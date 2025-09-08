import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HairstylesService } from './hairstyles.service';

@Controller('hairstyles')
export class HairstylesController {
  constructor(private readonly hairstylesService: HairstylesService) {}

  @Post()
  async create(@Body() body: any) {
    return this.hairstylesService.create(body);
  }

  @Get()
  async getAll() {
    return this.hairstylesService.findAll();
  }

  @Get('filter')
  async filterByFaceShape(@Query('faceShape') faceShape: string) {
    return this.hairstylesService.findByFaceShape(faceShape);
  }
}
