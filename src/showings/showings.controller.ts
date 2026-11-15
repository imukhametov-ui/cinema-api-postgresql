
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (positive integer)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Items per page (1-100)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    example: 'asc',
    description: 'Sort by showing start time',
  })
    @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  @Get()
  findAll(
    @Query('filmId') filmId?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.showingsService.findAll(
      filmId,
      date,
      page,
      limit,
      sort,
    );
  }
    @ApiNotFoundResponse({
    description: 'Showing not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showingsService.findOne(id);
  }
}
