
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ShowingsService } from './showings.service';
import { Showing } from './entities/showing.entity';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';

describe('ShowingsService', () => {
  let service: ShowingsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ShowingsService,
          {
            provide: getRepositoryToken(Showing),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
              createQueryBuilder: jest.fn(),
            },
          },
          {
            provide: FilmsService,
            useValue: {
              findOne: jest.fn(),
              findAll: jest.fn().mockResolvedValue([]),
            },
          },
          {
            provide: HallsService,
            useValue: {
              findOne: jest.fn(),
            },
          },
        ],
      }).compile();

    service = module.get<ShowingsService>(ShowingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
