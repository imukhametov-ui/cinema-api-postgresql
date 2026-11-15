
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Film } from '../../films/entities/film.entity';
import { Hall } from '../../halls/entities/hall.entity';

@Entity('showings')
export class Showing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'film_id', type: 'uuid' })
  filmId!: string;

  @Column({ name: 'hall_id', type: 'uuid' })
  hallId!: string;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'integer' })
  price!: number;

  @ManyToOne(() => Film, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'film_id' })
  film!: Film;

  @ManyToOne(() => Hall, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'hall_id' })
  hall!: Hall;
}
