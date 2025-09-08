import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Barbershop } from './barbershop.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.barbers)
  barbershop: Barbershop;

  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments: Appointment[];
}
