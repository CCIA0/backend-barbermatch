import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Barber } from './barber.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Barbershop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  schedule: string;

  @OneToMany(() => Barber, (barber) => barber.barbershop)
  barbers: Barber[];

  @OneToMany(() => Appointment, (appointment) => appointment.barbershop)
  appointments: Appointment[];
}
