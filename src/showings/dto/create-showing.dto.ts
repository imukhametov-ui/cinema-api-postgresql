
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsISO8601, IsInt, Min } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({
    description: 'Existing film UUID',
    format: 'uuid',
  })
  @IsUUID()
  filmId: string;

  @ApiProperty({
    description: 'Existing hall UUID',
    format: 'uuid',
  })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2030-12-25T18:00:00.000Z',
    description: 'Showing start time in ISO 8601 format',
    format: 'date-time',
  })
  @IsISO8601({ strict: true })
  startsAt: string;

  @ApiProperty({
    example: 25000,
    minimum: 1,
    description: 'Ticket price in kopecks',
  })
  @IsInt()
  @Min(1)
  price: number;
}
