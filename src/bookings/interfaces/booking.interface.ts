
export interface Seat {
  row: number;
  seat: number;
}

export interface Booking {
  id: string;
  showingId: string;
  seats: Seat[];
  totalPrice: number;
}
