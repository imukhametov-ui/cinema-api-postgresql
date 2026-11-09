
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ShowingsService } from './showings.service';
import { CreateShowingDto } from './dto/create-showing.dto';

@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
  ) {}

  @Post()
  create(@Body() dto: CreateShowingDto) {
    return this.showingsService.create(dto);
  }

  @ApiQuery({
    name: 'filmId',
    required: false,
    description: 'Filter by film UUID',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by UTC date (YYYY-MM-DD)',
    example: '2030-12-25',
  })
  @Get()
  findAll(
    @Query('filmId') filmId?: string,
    @Query('date') date?: string,
  ) {
    return this.showingsService.findAll(filmId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showingsService.findOne(id);
  }
}
