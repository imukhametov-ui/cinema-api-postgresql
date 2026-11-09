
import { Test, TestingModule } from '@nestjs/testing';
import { ShowingsController } from './showings.controller';
import { ShowingsService } from './showings.service';

describe('ShowingsController', () => {
  let controller: ShowingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowingsController],
      providers: [
        {
          provide: ShowingsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ShowingsController>(ShowingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
