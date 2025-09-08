import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbershopsService } from './barbershops.service';
import { BarbershopsController } from './barbershops.controller';
import { Barbershop } from '../entities/barbershop.entity';
import { Barber } from '../entities/barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop, Barber])],
  providers: [BarbershopsService],
  controllers: [BarbershopsController],
})
export class BarbershopsModule {}
