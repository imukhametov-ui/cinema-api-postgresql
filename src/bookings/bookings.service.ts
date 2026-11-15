
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ShowingsService } from '../showings/showings.service';
import { HallsService } from '../halls/halls.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingSeat } from './entities/booking-seat.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(BookingSeat)
    private readonly bookingSeatsRepository: Repository<BookingSeat>,

    private readonly dataSource: DataSource,
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  async create(showingId: string, dto: CreateBookingDto) {
    const showing = await this.showingsService.findOne(showingId);
    const hall = await this.hallsService.findOne(showing.hallId);

    const requestedSeats = dto.seats;
    const uniqueSeats = new Set<string>();

    for (const seat of requestedSeats) {
      const key = `${seat.row}:${seat.seat}`;

      if (uniqueSeats.has(key)) {
        throw new BadRequestException(
          'Duplicate seats in request',
        );
      }

      uniqueSeats.add(key);

      if (
        !Number.isInteger(seat.row) ||
        !Number.isInteger(seat.seat) ||
        seat.row < 1 ||
        seat.row > hall.rows ||
        seat.seat < 1 ||
        seat.seat > hall.seatsPerRow
      ) {
        throw new BadRequestException(
          'Seat is outside hall boundaries',
        );
      }
    }

    try {
      const booking = await this.dataSource.transaction(
        async (manager) => {
          const newBooking = manager.create(Booking, {
            showingId,
            totalPrice: requestedSeats.length * showing.price,
          });

          const savedBooking = await manager.save(
            Booking,
            newBooking,
          );

          const bookingSeats = requestedSeats.map((seat) =>
            manager.create(BookingSeat, {
              bookingId: savedBooking.id,
              showingId,
              row: seat.row,
              seat: seat.seat,
            }),
          );

          await manager.save(BookingSeat, bookingSeats);

          return savedBooking;
        },
      );

      return {
        id: booking.id,
        showingId: booking.showingId,
        seats: requestedSeats.map((seat) => ({
          row: seat.row,
          seat: seat.seat,
        })),
        totalPrice: booking.totalPrice,
      };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Seat is already booked');
      }

      throw error;
    }
  }

  async findAll() {
    const bookings = await this.bookingsRepository.find({
      relations: { seats: true },
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async findByShowing(showingId: string) {
    await this.showingsService.findOne(showingId);

    const bookings = await this.bookingsRepository.find({
      where: { showingId },
      relations: { seats: true },
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async getBookedSeats(showingId: string) {
    await this.showingsService.findOne(showingId);

    const seats = await this.bookingSeatsRepository.find({
      where: { showingId },
    });

    return seats.map((seat) => ({
      row: seat.row,
      seat: seat.seat,
    }));
  }

  async remove(id: string): Promise<void> {
    const booking = await this.bookingsRepository.findOneBy({
      id,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.bookingsRepository.remove(booking);
  }

  private toResponse(booking: Booking) {
    return {
      id: booking.id,
      showingId: booking.showingId,
      seats: booking.seats.map((seat) => ({
        row: seat.row,
        seat: seat.seat,
      })),
      totalPrice: booking.totalPrice,
    };
  }
}
