export type Reservation = {
  _id: string;
  year: string;
  status: "pending" | "confirmed" | "cancelled";
  nom: string;
  prenom: string;
  tel?: string;
  email?: string;
  escarenois?: boolean;
  places: string[];
  count?: number;
  total?: number;
  createdAt?: string;
};
