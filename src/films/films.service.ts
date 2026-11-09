
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Film } from './interfaces/film.interface';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ConflictException } from '@nestjs/common';
import { ShowingRelationsService } from '../showings/showing-relations.service';


@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];
  constructor(
  private readonly showingRelationsService: ShowingRelationsService,
) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };

    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return this.films;
    
  }

  findOne(id: string): Film {
    const film = this.films.find((item) => item.id === id);

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;

  }
  
update(id: string, dto: UpdateFilmDto): Film {
  const film = this.findOne(id);

  if (dto.title !== undefined) {
    film.title = dto.title;
  }

  if (dto.durationMinutes !== undefined) {
    film.durationMinutes = dto.durationMinutes;
  }

  if (dto.releaseYear !== undefined) {
    film.releaseYear = dto.releaseYear;
  }

  return film;
}

remove(id: string): void {
  const index = this.films.findIndex((film) => film.id === id);

  if (index === -1) {
    throw new NotFoundException('Film not found');
  }
if (this.showingRelationsService.hasFilm(id)) {
  throw new ConflictException(
    'Cannot delete film with existing showings',
  );
}
  this.films.splice(index, 1);
}

}
