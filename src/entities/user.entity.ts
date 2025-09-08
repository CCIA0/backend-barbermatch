import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['client', 'barber', 'admin'] })
  role: 'client' | 'barber' | 'admin';

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
