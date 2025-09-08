import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HairstylesService } from './hairstyles.service';
import { HairstylesController } from './hairstyles.controller';
import { Hairstyle } from '../entities/hairstyle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hairstyle])],
  providers: [HairstylesService],
  controllers: [HairstylesController],
})
export class HairstylesModule {}
