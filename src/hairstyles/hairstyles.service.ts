import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hairstyle } from '../entities/hairstyle.entity';

@Injectable()
export class HairstylesService {
  constructor(
    @InjectRepository(Hairstyle)
    private hairstyleRepository: Repository<Hairstyle>,
  ) {}

  async create(data: Partial<Hairstyle>): Promise<Hairstyle> {
    const hairstyle = this.hairstyleRepository.create(data);
    return this.hairstyleRepository.save(hairstyle);
  }

  async findAll(): Promise<Hairstyle[]> {
    return this.hairstyleRepository.find();
  }

  async findByFaceShape(faceShape: string): Promise<Hairstyle[]> {
    return this.hairstyleRepository
      .createQueryBuilder('hairstyle')
      .where(':faceShape = ANY(hairstyle.recommendedFaceShapes)', { faceShape })
      .getMany();
  }
}
