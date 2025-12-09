export interface OrderItem {
  id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  product_key: string;
  unit_key: string;
}

export type PaymentMethod = 'cash' | 'credit' | 'debit';

export type TableStatus = 'open' | 'paid';

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
  items: OrderItem[];
  createdAt: Date;
  closedAt?: Date;
  paymentMethod?: PaymentMethod;
  total: number;
}

export interface MenuItem {
  id: string;
  description: string;
  unit_price: number;
  category: string;
  product_key: string;
  unit_key: string;
}
