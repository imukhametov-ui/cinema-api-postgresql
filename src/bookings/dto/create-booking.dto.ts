
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeatDto } from './seat.dto';

export class CreateBookingDto {
  @ApiProperty({
    type: [SeatDto],
    description: 'Seats to book',
    example: [
      { row: 2, seat: 5 },
      { row: 2, seat: 6 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}

