
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowingsService } from '../showings/showings.service';

@ApiTags('Bookings')
@Controller()
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly showingsService: ShowingsService,
  ) {}
  @ApiOperation({ summary: 'Get showing seats with booking status' })
@ApiResponse({ status: 200, description: 'Seats with booking status' })
@ApiResponse({ status: 404, description: 'Showing not found' })
@Get('showings/:id/seats')
getSeats(@Param('id') id: string) {
  const seats = this.showingsService.getSeats(id);
  const bookedSeats = this.bookingsService.getBookedSeats(id);

  const booked = new Set(
    bookedSeats.map((seat) => `${seat.row}:${seat.seat}`),
  );

  return seats.map((seat) => ({
    ...seat,
    isBooked: booked.has(`${seat.row}:${seat.seat}`),
  }));
}
  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Book seats for a showing' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 400, description: 'Invalid seats' })
  @ApiResponse({ status: 404, description: 'Showing not found' })
  @ApiResponse({ status: 409, description: 'Seat already booked' })
  create(
    @Param('id') showingId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(showingId, dto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'Get bookings for a showing' })
  @ApiResponse({ status: 200, description: 'Showing bookings' })
  @ApiResponse({ status: 404, description: 'Showing not found' })
  findByShowing(@Param('id') showingId: string) {
    return this.bookingsService.findByShowing(showingId);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'All bookings' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 204, description: 'Booking cancelled' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string) {
    this.bookingsService.remove(id);
  }
}
