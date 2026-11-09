import { Test, TestingModule } from '@nestjs/testing';
import { HallsService } from './halls.service';
import { ShowingRelationsService } from '../showings/showing-relations.service';
describe('HallsService', () => {
  let service: HallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
     providers: [
  HallsService,
  {
    provide: ShowingRelationsService,
    useValue: {
      hasHall: jest.fn().mockReturnValue(false),
    },
  },
],
    }).compile();

    service = module.get<HallsService>(HallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
