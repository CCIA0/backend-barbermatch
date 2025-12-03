import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BarbershopsService } from '../barbershops/barbershops.service';
import { AppointmentsService } from '../appointments/appointments.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly barbershopsService: BarbershopsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get('users')
  async getUsers() {
    return this.usersService.findAll();
  }

  @Get('barbershops')
  async getBarbershops() {
    return this.barbershopsService.getBarbershops();
  }

  @Get('appointments')
  async getAppointments(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.appointmentsService.findByDateRange(startDate, endDate);
    }
    return this.appointmentsService.findAll();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  @Delete('barbershops/:id')
  async deleteBarbershop(@Param('id') id: number) {
    const deleted = await this.barbershopsService.deleteBarbershop(id);
    if (!deleted) {
      throw new NotFoundException('Barbershop not found');
    }
    return { message: 'Barbershop deleted successfully' };
  }

  @Get('dashboard')
  async getDashboard() {
    // Simulación de estadísticas
    return {
      users: 100,
      appointments: 50,
      barbershops: 10,
    };
  }
}
