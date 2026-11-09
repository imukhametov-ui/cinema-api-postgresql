import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowingsService } from '../showings/showings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
  {
    provide: BookingsService,
    useValue: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByShowing: jest.fn(),
      getBookedSeats: jest.fn(),
      remove: jest.fn(),
    },
  },
  {
    provide: ShowingsService,
    useValue: {
      getSeats: jest.fn(),
    },
  },
],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
