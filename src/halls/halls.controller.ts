
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';

@Controller('halls')
export class HallsController {
  constructor(
    private readonly hallsService: HallsService,
  ) {}

  @Post()
  create(@Body() dto: CreateHallDto) {
    return this.hallsService.create(dto);
  }

  @Get()
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hallsService.findOneWithSeats(id);
  }

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(
  @Param('id', ParseUUIDPipe) id: string,
): Promise<void> {
  await this.hallsService.remove(id);
}
}
