
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hall } from './entities/hall.entity';
import { Showing } from '../showings/entities/showing.entity';
import { CreateHallDto } from './dto/create-hall.dto';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallsRepository: Repository<Hall>,

    @InjectRepository(Showing)
    private readonly showingsRepository: Repository<Showing>,
  ) {}

  async create(dto: CreateHallDto): Promise<Hall> {
    const exists = await this.hallsRepository.existsBy({
      name: dto.name,
    });

    if (exists) {
      throw new ConflictException('Hall name already exists');
    }

    const hall = this.hallsRepository.create(dto);

    try {
      return await this.hallsRepository.save(hall);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Hall name already exists');
      }

      throw error;
    }
  }

  async findAll(): Promise<Hall[]> {
    return this.hallsRepository.find();
  }

  async findOne(id: string): Promise<Hall> {
    const hall = await this.hallsRepository.findOneBy({ id });

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    return hall;
  }

  async findOneWithSeats(id: string) {
    const hall = await this.findOne(id);

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

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const hasShowings = await this.showingsRepository.existsBy({
      hallId: id,
    });

    if (hasShowings) {
      throw new ConflictException(
        'Cannot delete hall with existing showings',
      );
    }

    await this.hallsRepository.delete(id);
  }
}
