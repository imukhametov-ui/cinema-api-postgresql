
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { HallsService } from '../halls/halls.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, Seat } from './interfaces/booking.interface';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  create(showingId: string, dto: CreateBookingDto): Booking {
    // 404 if the showing does not exist
    const showing = this.showingsService.findOne(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    const requestedSeats = dto.seats;
    const uniqueSeats = new Set<string>();

    // Validate all seats before creating the booking
    for (const seat of requestedSeats) {
      const key = `${seat.row}:${seat.seat}`;

      if (uniqueSeats.has(key)) {
        throw new BadRequestException(
          'Duplicate seats in request',
        );
      }

      uniqueSeats.add(key);

      if (
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

    // Check previously booked seats
    const existingBookings = this.bookings.filter(
      (booking) => booking.showingId === showingId,
    );

    for (const booking of existingBookings) {
      for (const seat of booking.seats) {
        const key = `${seat.row}:${seat.seat}`;

        if (uniqueSeats.has(key)) {
          throw new ConflictException(
            'Seat is already booked',
          );
        }
      }
    }

    // Save only after all validations pass
    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: requestedSeats.map(
        (seat): Seat => ({
          row: seat.row,
          seat: seat.seat,
        }),
      ),
      totalPrice: requestedSeats.length * showing.price,
    };

    this.bookings.push(booking);

    return booking;
  }

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findOne(showingId);

    return this.bookings.filter(
      (booking) => booking.showingId === showingId,
    );
  }

  getBookedSeats(showingId: string): Seat[] {
    return this.findByShowing(showingId).flatMap(
      (booking) => booking.seats,
    );
  }

  remove(id: string): void {
    const index = this.bookings.findIndex(
      (booking) => booking.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Booking not found');
    }

    this.bookings.splice(index, 1);
  }
}
