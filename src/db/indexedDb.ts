import Dexie, { Table } from 'dexie';
import type { Expense } from '../models/expense';

export interface PendingOp {
  queueId?: number;
  operationId: string;
  type: 'add' | 'update' | 'delete';
  expenseId: string;
  month: string;
  payload: any;
  createdAt: string;
  retryCount: number;
}

class DuitKitaDB extends Dexie {
  expenses!: Table<Expense, string>;
  pendingQueue!: Table<PendingOp, number>;

  constructor() {
    super('DuitKitaDB');
    this.version(1).stores({
      expenses: 'id, month, date, paidBy, category',
      pendingQueue: '++queueId, operationId, type, expenseId, month'
    });
  }
}

export const db = new DuitKitaDB();

