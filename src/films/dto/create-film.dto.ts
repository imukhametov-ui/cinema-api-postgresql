
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({
    example: 'Interstellar',
    description: 'Film title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 169,
    description: 'Film duration in minutes',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({
    example: 2014,
    description: 'Film release year',
    minimum: 1888,
    maximum: 2100,
  })
  @IsInt()
  @Min(1888)
  @Max(2100)
  releaseYear: number;
}
