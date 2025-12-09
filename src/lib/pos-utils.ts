import { Table, OrderItem, MenuItem } from '@/types/pos';

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `ord_${timestamp}${randomPart}`;
}

export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export const defaultMenuItems: MenuItem[] = [
  { id: '1', description: 'Classic Cheeseburger', unit_price: 12.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '2', description: 'Margherita Pizza', unit_price: 16.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '3', description: 'Caesar Salad', unit_price: 9.49, category: 'Salads', product_key: '80141503', unit_key: 'E48' },
  { id: '4', description: 'Fish and Chips', unit_price: 14.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '5', description: 'Grilled Salmon', unit_price: 22.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '6', description: 'Vegetarian Pad Thai', unit_price: 13.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '7', description: 'Belgian Waffles', unit_price: 8.99, category: 'Dessert', product_key: '80141503', unit_key: 'E48' },
  { id: '8', description: 'Shrimp Tacos', unit_price: 11.49, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '9', description: 'Greek Gyro Plate', unit_price: 13.99, category: 'Main', product_key: '80141503', unit_key: 'E48' },
  { id: '10', description: 'Classic Lemonade', unit_price: 4.49, category: 'Drinks', product_key: '80141503', unit_key: 'E48' },
  { id: '11', description: 'Virgin Mojito', unit_price: 5.99, category: 'Drinks', product_key: '80141503', unit_key: 'E48' },
  { id: '12', description: 'Iced Coffee', unit_price: 4.99, category: 'Drinks', product_key: '80141503', unit_key: 'E48' },
  { id: '13', description: 'Chocolate Cake', unit_price: 7.99, category: 'Dessert', product_key: '80141503', unit_key: 'E48' },
  { id: '14', description: 'Garlic Bread', unit_price: 5.49, category: 'Starters', product_key: '80141503', unit_key: 'E48' },
  { id: '15', description: 'Soup of the Day', unit_price: 6.99, category: 'Starters', product_key: '80141503', unit_key: 'E48' },
];
