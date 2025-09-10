import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateHairstyleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  recommendedFaceShapes: string[];
}
