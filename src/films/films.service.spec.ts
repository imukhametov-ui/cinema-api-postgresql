
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { Showing } from '../showings/entities/showing.entity';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          FilmsService,
          {
            provide: getRepositoryToken(Film),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(Showing),
            useValue: {
              count: jest.fn().mockResolvedValue(0),
            },
          },
        ],
      }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
