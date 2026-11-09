
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ShowingRelationsService } from '../showings/showing-relations.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
  FilmsService,
  {
    provide: ShowingRelationsService,
    useValue: {
      hasFilm: jest.fn().mockReturnValue(false),
    },
  },
],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
