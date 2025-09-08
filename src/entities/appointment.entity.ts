import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Barber } from './barber.entity';
import { Barbershop } from './barbershop.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled'] })
  status: 'pending' | 'confirmed' | 'cancelled';

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @ManyToOne(() => Barber, (barber) => barber.appointments)
  barber: Barber;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.appointments)
  barbershop: Barbershop;
}
