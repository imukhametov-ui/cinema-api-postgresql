
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BookingSeat } from './entities/booking-seat.entity';
import { ShowingsService } from '../showings/showings.service';
import { HallsService } from '../halls/halls.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          BookingsService,
          {
            provide: getRepositoryToken(Booking),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOne: jest.fn(),
              delete: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(BookingSeat),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOne: jest.fn(),
              delete: jest.fn(),
            },
          },
          {
            provide: DataSource,
            useValue: {
              transaction: jest.fn(),
            },
          },
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
