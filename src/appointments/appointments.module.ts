import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Barber } from '../entities/barber.entity';
import { Barbershop } from '../entities/barbershop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Barber, Barbershop])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
