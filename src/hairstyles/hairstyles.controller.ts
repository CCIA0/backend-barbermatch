import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HairstylesService } from './hairstyles.service';

@Controller('hairstyles')
export class HairstylesController {
  constructor(private readonly hairstylesService: HairstylesService) {}

  @Post()
  async create(@Body() createHairstyleDto: any) {
    return this.hairstylesService.create(createHairstyleDto);
  }

  @Get()
  async findAll() {
    return this.hairstylesService.findAll();
  }

  @Get('filter')
  async findByFaceShape(@Query('faceShape') faceShape: string) {
    return this.hairstylesService.findByFaceShape(faceShape);
  }
}
