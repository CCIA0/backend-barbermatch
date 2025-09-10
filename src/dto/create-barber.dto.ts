import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateBarberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];
}
