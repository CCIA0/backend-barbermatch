import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateHairstyleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  recommendedFaceShapes: string[];
}
