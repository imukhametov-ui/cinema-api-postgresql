
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Hall } from '../halls/entities/hall.entity';
import { Showing } from '../showings/entities/showing.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingSeat } from '../bookings/entities/booking-seat.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [Film, Hall, Showing, Booking, BookingSeat],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
  uuidExtension: 'pgcrypto',
});
