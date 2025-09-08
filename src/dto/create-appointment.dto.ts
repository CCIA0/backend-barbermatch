import { IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status: 'pending' | 'confirmed' | 'cancelled';

  @IsNumber()
  userId: number;

  @IsNumber()
  barberId: number;

  @IsNumber()
  barbershopId: number;
}
