
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({
    example: 'Hall 1',
    description: 'Unique hall name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: 'Number of rows',
  })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({
    example: 10,
    minimum: 1,
    description: 'Seats per row',
  })
  @IsInt()
  @Min(1)
  seatsPerRow: number;
}
