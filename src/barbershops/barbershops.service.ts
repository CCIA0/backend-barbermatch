import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barbershop } from '../entities/barbershop.entity';
import { Barber } from '../entities/barber.entity';

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private barbershopRepository: Repository<Barbershop>,
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
  ) {}

  async createBarbershop(data: Partial<Barbershop>): Promise<Barbershop> {
    const barbershop = this.barbershopRepository.create(data);
    return this.barbershopRepository.save(barbershop);
  }

  async getBarbershops(): Promise<Barbershop[]> {
    return this.barbershopRepository.find({
      relations: ['barbers', 'appointments'],
    });
  }

  async addBarber(
    barbershopId: number,
    barberData: Partial<Barber>,
  ): Promise<Barber> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id: barbershopId },
    });
    if (!barbershop) throw new Error('Barbershop not found');
    const barber = this.barberRepository.create({ ...barberData, barbershop });
    return this.barberRepository.save(barber);
  }

  async deleteBarbershop(id: number): Promise<boolean> {
    const result = await this.barbershopRepository.delete(id);
    return result.affected > 0;
  }
}
