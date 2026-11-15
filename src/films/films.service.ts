
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from './entities/film.entity';
import { Showing } from '../showings/entities/showing.entity';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,

    @InjectRepository(Showing)
    private readonly showingsRepository: Repository<Showing>,
  ) {}

  async create(dto: CreateFilmDto): Promise<Film> {
    const film = this.filmsRepository.create(dto);
    return this.filmsRepository.save(film);
  }

  async findAll(): Promise<Film[]> {
    return this.filmsRepository.find();
  }

  async findOne(id: string): Promise<Film> {
    const film = await this.filmsRepository.findOneBy({ id });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  async update(id: string, dto: UpdateFilmDto): Promise<Film> {
    const film = await this.findOne(id);

    Object.assign(film, dto);

    return this.filmsRepository.save(film);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const hasShowings = await this.showingsRepository.existsBy({
      filmId: id,
    });

    if (hasShowings) {
      throw new ConflictException(
        'Cannot delete film with existing showings',
      );
    }

    await this.filmsRepository.delete(id);
  }
}
