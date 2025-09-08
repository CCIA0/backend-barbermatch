import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) body: CreateAppointmentDto) {
    const appointmentData = {
      ...body,
      date: new Date(body.date),
    };
    return this.appointmentsService.create(appointmentData);
  }

  @Get()
  async getAll() {
    return this.appointmentsService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.appointmentsService.update(id, body);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: number) {
    return this.appointmentsService.cancel(id);
  }
}
