
import { Injectable } from '@nestjs/common';
import { Showing } from './interfaces/showing.interface';

@Injectable()
export class ShowingRelationsService {
  private readonly showings: Showing[] = [];

  add(showing: Showing): void {
    this.showings.push(showing);
  }

  findAll(): Showing[] {
    return this.showings;
  }

  hasFilm(filmId: string): boolean {
    return this.showings.some(
      (showing) => showing.filmId === filmId,
    );
  }

  hasHall(hallId: string): boolean {
    return this.showings.some(
      (showing) => showing.hallId === hallId,
    );
  }
}
