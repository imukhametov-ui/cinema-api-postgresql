
import { Module } from '@nestjs/common';
import { ShowingsController } from './showings.controller';
import { ShowingsService } from './showings.service';
import { FilmsModule } from '../films/films.module';
import { HallsModule } from '../halls/halls.module';

@Module({
  imports: [FilmsModule, HallsModule],
  controllers: [ShowingsController],
  providers: [ShowingsService],
  exports: [ShowingsService],
})
export class ShowingsModule {}
