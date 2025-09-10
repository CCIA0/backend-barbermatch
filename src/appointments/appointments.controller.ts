import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createAppointmentDto: CreateAppointmentDto) {
    const appointmentData = {
      ...createAppointmentDto,
      date: new Date(createAppointmentDto.date),
    };
    const appointment = await this.appointmentsService.create(appointmentData);
    if (!appointment) {
      throw new Error('Failed to create appointment');
    }
    return appointment;
  }

  @Get()
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAppointmentDto: Partial<CreateAppointmentDto>) {
    const appointment = await this.appointmentsService.update(id, updateAppointmentDto);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  @Delete(':id')
  async cancel(@Param('id') id: number) {
    const appointment = await this.appointmentsService.cancel(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }
}
