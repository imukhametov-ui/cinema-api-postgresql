
import { Module } from '@nestjs/common';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Showing } from '../showings/entities/showing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall, Showing])],
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService],
})
export class HallsModule {}
