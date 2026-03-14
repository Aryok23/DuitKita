import React from 'react';
import type { Expense } from '../../models/expense';
import { formatRupiah } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/date';

interface Props {
  expense: Expense;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ExpenseCard: React.FC<Props> = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl shadow bg-white p-4 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="font-semibold">{expense.item}</div>
        <div className="font-bold text-sm">{formatRupiah(expense.amount)}</div>
      </div>
      <div className="text-xs text-gray-500">
        {expense.category} • {expense.paymentMethod}
      </div>
      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>
          {expense.paidBy} • {formatDisplayDate(expense.date)}
        </span>
        {expense.isPending && <span className="text-[10px] text-orange-500">Pending</span>}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-3 pt-1 text-xs">
          {onEdit && (
            <button className="text-blue-600" onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="text-red-500" onClick={onDelete}>
              Hapus
            </button>
          )}
        </div>
      )}
    </div>
  );
};

