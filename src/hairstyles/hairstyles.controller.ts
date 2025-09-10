import { Controller, Get, Post, Body, Query, ValidationPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HairstylesService } from './hairstyles.service';
import { CreateHairstyleDto } from '../dto/create-hairstyle.dto';

@Controller('hairstyles')
export class HairstylesController {
  constructor(private readonly hairstylesService: HairstylesService) {}

  @Post()
  async create(@Body(ValidationPipe) createHairstyleDto: CreateHairstyleDto) {
    try {
      const hairstyle = await this.hairstylesService.create(createHairstyleDto);
      if (!hairstyle) {
        throw new InternalServerErrorException('Failed to create hairstyle');
      }
      return hairstyle;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create hairstyle');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.hairstylesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch hairstyles');
    }
  }

  @Get('filter')
  async findByFaceShape(@Query('faceShape', ValidationPipe) faceShape: string) {
    try {
      if (!faceShape) {
        throw new BadRequestException('Face shape is required');
      }
      return await this.hairstylesService.findByFaceShape(faceShape);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch hairstyles');
    }
  }
}
