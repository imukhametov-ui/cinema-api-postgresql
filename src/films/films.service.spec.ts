import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { ShowingRelationsService } from '../showings/showing-relations.service';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
