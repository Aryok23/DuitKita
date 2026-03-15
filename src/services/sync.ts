import { db } from '../db/indexedDb';
import { apiAddExpense, apiUpdateExpense, apiDeleteExpense } from './api';

// Prevents concurrent sync runs (e.g. add + immediate page refresh both fire runSync)
let isSyncing = false;

export async function runSync(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const items = await db.pendingQueue.orderBy('queueId').toArray();
    for (const op of items) {
      try {
        if (op.type === 'add') {
          await apiAddExpense(op.payload);
          await db.expenses.update(op.expenseId, { isPending: false });
        } else if (op.type === 'update') {
          await apiUpdateExpense(op.payload);
          await db.expenses.update(op.expenseId, { isPending: false });
        } else if (op.type === 'delete') {
          await apiDeleteExpense(op.payload.id, op.month);
          await db.expenses.delete(op.expenseId);
        }
        await db.pendingQueue.delete(op.queueId!);
      } catch (_e) {
        const retryCount = (op.retryCount || 0) + 1;
        await db.pendingQueue.update(op.queueId!, { retryCount });
        break;
      }
    }
  } finally {
    isSyncing = false;
  }
}
