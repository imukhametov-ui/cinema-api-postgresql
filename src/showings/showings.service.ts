
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { Showing } from './interfaces/showing.interface';
import { ShowingRelationsService } from './showing-relations.service';

@Injectable()
export class ShowingsService {
  private get showings(): Showing[] {
  return this.showingRelationsService.findAll();
}

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
    private readonly showingRelationsService: ShowingRelationsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    try {
      this.filmsService.findOne(dto.filmId);
    } catch {
      throw new BadRequestException('Film does not exist');
    }

    try {
      this.hallsService.findOne(dto.hallId);
    } catch {
      throw new BadRequestException('Hall does not exist');
    }

    const startsAt = new Date(dto.startsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      startsAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'Showing must start in the future',
      );
    }

    if (!Number.isInteger(dto.price) || dto.price <= 0) {
      throw new BadRequestException(
        'Price must be a positive integer',
      );
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: startsAt.toISOString(),
      price: dto.price,
    };

    this.showings.push(showing);

    return showing;
  }

  
findAll(filmId?: string, date?: string) {
  if (filmId && !this.filmsService.findAll().some(
    (film) => film.id === filmId,
  )) {
    throw new BadRequestException('Film does not exist');
  }

  if (date) {
    const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      !validFormat ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException('Invalid date format');
    }
  }

  return this.showings
    .filter((showing) => !filmId || showing.filmId === filmId)
    .filter(
      (showing) => !date || showing.startsAt.slice(0, 10) === date,
    )
    .sort(
      (a, b) =>
        a.startsAt.localeCompare(b.startsAt) ||
        a.id.localeCompare(b.id),
    )
    .map((showing) => ({
      ...showing,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
    }));
}


  findOne(id: string): Showing {
    const showing = this.showings.find(
      (item) => item.id === id,
    );

    if (!showing) {
      throw new NotFoundException('Showing not found');
    }

    return showing;
  }
  
getSeats(id: string) {
  const showing = this.findOne(id);
  const hall = this.hallsService.findOne(showing.hallId);

  const seats: {
    row: number;
    seat: number;
    isBooked: boolean;
  }[] = [];

  for (let row = 1; row <= hall.rows; row++) {
    for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
      seats.push({
        row,
        seat,
        isBooked: false,
      });
    }
  }

  return seats;
}

}
