
import { ApiProperty } from '@nestjs/swagger';

export class ShowingResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  filmId!: string;

  @ApiProperty({ format: 'uuid' })
  hallId!: string;

  @ApiProperty({ example: '2030-12-25T18:00:00.000Z' })
  startsAt!: string;

  @ApiProperty({ example: 250 })
  price!: number;

  @ApiProperty({ example: 'Interstellar' })
  filmTitle!: string;

  @ApiProperty({ example: 'Hall A' })
  hallName!: string;
}

export class PaginatedShowingsDto {
  @ApiProperty({ type: () => [ShowingResponseDto] })
  items!: ShowingResponseDto[];

  @ApiProperty({ example: 4 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;
}
