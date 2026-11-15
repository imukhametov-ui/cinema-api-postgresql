
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HallsService } from './halls.service';
import { Hall } from './entities/hall.entity';
import { Showing } from '../showings/entities/showing.entity';

describe('HallsService', () => {
  let service: HallsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          HallsService,
          {
            provide: getRepositoryToken(Hall),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOne: jest.fn(),
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

    service = module.get<HallsService>(HallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
