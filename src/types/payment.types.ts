export interface Payment {
  id: string
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerId: string;
  date: string;
  chargeId: string;
  userId: string;
}