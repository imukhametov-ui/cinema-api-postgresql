
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('halls')
@Unique('UQ_halls_name', ['name'])
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'integer' })
  rows!: number;

  @Column({ name: 'seats_per_row', type: 'integer' })
  seatsPerRow!: number;
}
