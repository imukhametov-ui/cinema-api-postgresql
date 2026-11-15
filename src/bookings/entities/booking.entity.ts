
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Showing } from '../../showings/entities/showing.entity';
import { BookingSeat } from './booking-seat.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'showing_id', type: 'uuid' })
  showingId!: string;

  @Column({ name: 'total_price', type: 'integer' })
  totalPrice!: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt!: Date;

  @ManyToOne(() => Showing, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'showing_id' })
  showing!: Showing;

  @OneToMany(() => BookingSeat, (seat) => seat.booking)
  seats!: BookingSeat[];
}
