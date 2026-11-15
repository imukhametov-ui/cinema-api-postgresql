

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { Showing } from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  constructor(
    @InjectRepository(Showing)
    private readonly showingsRepository: Repository<Showing>,
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  async create(dto: CreateShowingDto): Promise<Showing> {
    try {
      await this.filmsService.findOne(dto.filmId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Film does not exist');
      }
      throw error;
    }

    try {
      await this.hallsService.findOne(dto.hallId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Hall does not exist');
      }
      throw error;
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

    const showing = this.showingsRepository.create({
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt,
      price: dto.price,
    });

    return this.showingsRepository.save(showing);
  }

  async findAll(
    filmId?: string,
    date?: string,
    page?: string,
    limit?: string,
    sort?: string,
  ) {
    if (filmId !== undefined && !isUUID(filmId)) {
      throw new BadRequestException('Invalid filmId');
    }

    if (filmId) {
      try {
        await this.filmsService.findOne(filmId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Film does not exist');
        }
        throw error;
      }
    }

    if (date !== undefined) {
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

    const parsePositiveInteger = (
      value: string | undefined,
      defaultValue: number,
      name: string,
      max?: number,
    ): number => {
      if (value === undefined) return defaultValue;

      if (!/^[1-9]\d*$/.test(value)) {
        throw new BadRequestException(`Invalid ${name}`);
      }

      const parsed = Number(value);

      if (!Number.isSafeInteger(parsed) || (max && parsed > max)) {
        throw new BadRequestException(`Invalid ${name}`);
      }

      return parsed;
    };

    const currentPage = parsePositiveInteger(page, 1, 'page');
    const currentLimit = parsePositiveInteger(limit, 20, 'limit', 100);

    if (sort !== undefined && sort !== 'asc' && sort !== 'desc') {
      throw new BadRequestException('Invalid sort');
    }

    const direction: 'ASC' | 'DESC' =
      sort === 'desc' ? 'DESC' : 'ASC';

    const query = this.showingsRepository
      .createQueryBuilder('showing')
      .innerJoinAndSelect('showing.film', 'film')
      .innerJoinAndSelect('showing.hall', 'hall');

    if (filmId) {
      query.andWhere('showing.filmId = :filmId', { filmId });
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      query.andWhere(
        'showing.startsAt >= :start AND showing.startsAt < :end',
        { start, end },
      );
    }

    const [showings, total] = await query
      .orderBy('showing.startsAt', direction)
      .addOrderBy('showing.id', direction)
      .skip((currentPage - 1) * currentLimit)
      .take(currentLimit)
      .getManyAndCount();

    return {
      items: showings.map((showing) => ({
        id: showing.id,
        filmId: showing.filmId,
        hallId: showing.hallId,
        startsAt: showing.startsAt.toISOString(),
        price: showing.price,
        filmTitle: showing.film.title,
        hallName: showing.hall.name,
      })),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Showing not found');
    }

    const showing = await this.showingsRepository.findOne({
      where: { id },
      relations: { film: true, hall: true },
    });

    if (!showing) {
      throw new NotFoundException('Showing not found');
    }

    return {
      id: showing.id,
      filmId: showing.filmId,
      hallId: showing.hallId,
      startsAt: showing.startsAt.toISOString(),
      price: showing.price,
      filmTitle: showing.film.title,
      hallName: showing.hall.name,
    };
  }

  async getSeats(id: string) {
    const showing = await this.findOne(id);
    const hall = await this.hallsService.findOne(showing.hallId);

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
