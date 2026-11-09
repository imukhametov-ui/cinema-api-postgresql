
import { IsInt, IsOptional, IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateFilmDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  releaseYear?: number;
}
