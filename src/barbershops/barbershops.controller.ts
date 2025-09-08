import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.barbershopsService.createBarbershop(body);
  }

  @Get()
  async getAll() {
    return this.barbershopsService.getBarbershops();
  }

  @Post(':id/barbers')
  async addBarber(@Param('id') id: number, @Body() body: any) {
    return this.barbershopsService.addBarber(id, body);
  }
}
