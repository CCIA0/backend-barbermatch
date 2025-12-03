import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Barber } from '../entities/barber.entity';
import { Barbershop } from '../entities/barbershop.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
    @InjectRepository(Barbershop)
    private barbershopRepository: Repository<Barbershop>,
  ) {}

  async create(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(data);
    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['user', 'barber', 'barbershop'],
    });
  }

  async update(
    id: number,
    data: Partial<Appointment>,
  ): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) return null;
    Object.assign(appointment, data);
    return this.appointmentRepository.save(appointment);
  }

  async cancel(id: number): Promise<Appointment | null> {
    return this.update(id, { status: 'cancelled' });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Appointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.barber', 'barber')
      .leftJoinAndSelect('appointment.barbershop', 'barbershop')
      .where('appointment.date >= :startDate', { startDate })
      .andWhere('appointment.date <= :endDate', { endDate })
      .getMany();
  }
}
