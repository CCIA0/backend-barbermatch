import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ParseIntPipe,
 ValidationPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
  ) {
    try {
      const date = new Date(createAppointmentDto.date);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const appointmentData = {
        ...createAppointmentDto,
        date,
      };

      const appointment =
        await this.appointmentsService.create(appointmentData);
      if (!appointment) {
        throw new InternalServerErrorException('Failed to create appointment');
      }
      return appointment;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  @Get()
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAppointmentDto: Partial<CreateAppointmentDto>,
  ) {
    try {
      const updateData: any = { ...updateAppointmentDto };

      if (updateAppointmentDto.date) {
        const date = new Date(updateAppointmentDto.date);
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Invalid date format');
        }
        updateData.date = date;
      }

      const appointment = await this.appointmentsService.update(id, updateData);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      return appointment;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update appointment');
    }
  }

  @Delete(':id')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    try {
      const appointment = await this.appointmentsService.cancel(id);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      return appointment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to cancel appointment');
    }
  }
}
