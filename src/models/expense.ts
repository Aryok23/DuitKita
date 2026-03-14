export type PaidBy = 'Ibu' | 'Rosita' | 'Aryo' | 'Shafa' | 'Together';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Groceries'
  | 'Utilities'
  | 'Health'
  | 'Entertainment'
  | 'Shopping'
  | 'Education'
  | 'Others';

export type PaymentMethod = 'Cash' | 'Debit' | 'm-Banking';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  item: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  paidBy: PaidBy;
  createdAt: string;
  month: string; // YYYY-MM
  isPending?: boolean;
  isDeleted?: boolean;
}

