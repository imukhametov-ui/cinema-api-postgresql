import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Hall } from './interfaces/hall.interface';
import { CreateHallDto } from './dto/create-hall.dto';
import { ShowingRelationsService } from '../showings/showing-relations.service';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];
constructor(
  private readonly showingRelationsService: ShowingRelationsService,
) {}
  create(dto: CreateHallDto): Hall {
    const exists = this.halls.some(
      (hall) => hall.name === dto.name,
    );

    if (exists) {
      throw new ConflictException('Hall name already exists');
    }

    const hall: Hall = {
      id: randomUUID(),
      name: dto.name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };

    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  findOne(id: string): Hall {
    const hall = this.halls.find((item) => item.id === id);

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    return hall;
  }
  
  findOneWithSeats(id: string) {
    const hall = this.findOne(id);

    const seats: { row: number; seat: number }[] = [];

    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }

    return {
      ...hall,
      seats,
    };
  }

  remove(id: string): void {
    const index = this.halls.findIndex(
      (hall) => hall.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Hall not found');
    }
if (this.showingRelationsService.hasHall(id)) {
  throw new ConflictException(
    'Cannot delete hall with existing showings',
  );
}
    this.halls.splice(index, 1);
  }

}
