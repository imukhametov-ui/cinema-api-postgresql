
import { AppDataSource } from './database/data-source';
import { Film } from './films/entities/film.entity';
import { Hall } from './halls/entities/hall.entity';
import { Showing } from './showings/entities/showing.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookingSeat } from './bookings/entities/booking-seat.entity';

async function seed() {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const filmRepository = manager.getRepository(Film);
      const hallRepository = manager.getRepository(Hall);
      const showingRepository = manager.getRepository(Showing);
      const bookingRepository = manager.getRepository(Booking);
      const seatRepository = manager.getRepository(BookingSeat);

      const filmData = [
        {
          title: 'Interstellar',
          durationMinutes: 169,
          releaseYear: 2014,
        },
        {
          title: 'Inception',
          durationMinutes: 148,
          releaseYear: 2010,
        },
      ];

      const films: Film[] = [];

      for (const data of filmData) {
        let film = await filmRepository.findOne({
          where: { title: data.title },
        });

        if (!film) {
          film = await filmRepository.save(
            filmRepository.create(data),
          );
        }

        films.push(film);
      }

      const hallData = [
        { name: 'Hall A', rows: 5, seatsPerRow: 10 },
        { name: 'Hall B', rows: 8, seatsPerRow: 12 },
      ];

      const halls: Hall[] = [];

      for (const data of hallData) {
        let hall = await hallRepository.findOne({
          where: { name: data.name },
        });

        if (!hall) {
          hall = await hallRepository.save(
            hallRepository.create(data),
          );
        }

        halls.push(hall);
      }

      const showingData = [
        {
          filmId: films[0].id,
          hallId: halls[0].id,
          startsAt: new Date('2026-12-25T18:00:00Z'),
          price: 25000,
        },
        {
          filmId: films[1].id,
          hallId: halls[1].id,
          startsAt: new Date('2026-12-26T19:00:00Z'),
          price: 22000,
        },
        {
          filmId: films[0].id,
          hallId: halls[1].id,
          startsAt: new Date('2026-12-27T17:00:00Z'),
          price: 24000,
        },
        {
          filmId: films[1].id,
          hallId: halls[0].id,
          startsAt: new Date('2026-12-28T20:00:00Z'),
          price: 26000,
        },
      ];

      const showings: Showing[] = [];

      for (const data of showingData) {
        let showing = await showingRepository.findOne({
          where: {
            filmId: data.filmId,
            hallId: data.hallId,
            startsAt: data.startsAt,
          },
        });

        if (!showing) {
          showing = await showingRepository.save(
            showingRepository.create(data),
          );
        }

        showings.push(showing);
      }

      // Використовуємо останній сеанс, щоб не
      // конфліктувати з раніше створеними бронюваннями.
      const showing = showings[3];

      const existingSeat = await seatRepository.findOne({
        where: {
          showingId: showing.id,
          row: 1,
          seat: 1,
        },
      });

      if (!existingSeat) {
        const booking = await bookingRepository.save(
          bookingRepository.create({
            showingId: showing.id,
            totalPrice: showing.price,
          }),
        );

        await seatRepository.save(
          seatRepository.create({
            bookingId: booking.id,
            showingId: showing.id,
            row: 1,
            seat: 1,
          }),
        );
      }

      console.log('Seed completed successfully');
    });
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
