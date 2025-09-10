import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Post()
  async createBarbershop(@Body() createBarbershopDto: any) {
    return this.barbershopsService.createBarbershop(createBarbershopDto);
  }

  @Get()
  async getBarbershops() {
    return this.barbershopsService.getBarbershops();
  }

  @Post(':id/barbers')
  async addBarber(@Param('id') id: number, @Body() barberData: any) {
    return this.barbershopsService.addBarber(id, barberData);
  }
}
