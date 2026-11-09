import { Test, TestingModule } from '@nestjs/testing';
import { ShowingsService } from './showings.service';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { ShowingRelationsService } from './showing-relations.service';

describe('ShowingsService', () => {
  let service: ShowingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
  ShowingsService,
  {
    provide: FilmsService,
    useValue: {
      findOne: jest.fn(),
      findAll: jest.fn().mockReturnValue([]),
    },
  },
  {
    provide: HallsService,
    useValue: {
      findOne: jest.fn(),
    },
  },
  {
    provide: ShowingRelationsService,
    useValue: {
      findAll: jest.fn().mockReturnValue([]),
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
