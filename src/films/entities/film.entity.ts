
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ name: 'duration_minutes', type: 'integer' })
  durationMinutes!: number;

  @Column({ name: 'release_year', type: 'integer' })
  releaseYear!: number;
}
