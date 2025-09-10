import { Controller, Get, Post, Body, Param, ValidationPipe, NotFoundException, BadRequestException, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';
import { CreateBarbershopDto } from '../dto/create-barbershop.dto';
import { CreateBarberDto } from '../dto/create-barber.dto';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Post()
  async createBarbershop(@Body(ValidationPipe) createBarbershopDto: CreateBarbershopDto) {
    try {
      const barbershop = await this.barbershopsService.createBarbershop(createBarbershopDto);
      if (!barbershop) {
        throw new InternalServerErrorException('Failed to create barbershop');
      }
      return barbershop;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create barbershop');
    }
  }

  @Get()
  async getBarbershops() {
    return this.barbershopsService.getBarbershops();
  }

  @Post(':id/barbers')
  async addBarber(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) barberData: CreateBarberDto
  ) {
    try {
      const barbershop = await this.barbershopsService.addBarber(id, barberData);
      if (!barbershop) {
        throw new NotFoundException('Barbershop not found');
      }
      return barbershop;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add barber to barbershop');
    }
  }
}
