
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateSync, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmsModule } from './films/films.module';
import { HallsModule } from './halls/halls.module';
import { ShowingsModule } from './showings/showings.module';
import { BookingsModule } from './bookings/bookings.module';
import { ShowingRelationsModule } from './showings/showing-relations.module';

class EnvironmentVariables {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE!: string;
}

function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        uuidExtension: 'pgcrypto',
      }),
    }),

    ShowingRelationsModule,
    FilmsModule,
    HallsModule,
    ShowingsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
