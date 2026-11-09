import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ShowingsService } from '../showings/showings.service';
import { HallsService } from '../halls/halls.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
  BookingsService,
  {
    provide: ShowingsService,
    useValue: {
      findOne: jest.fn(),
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

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
