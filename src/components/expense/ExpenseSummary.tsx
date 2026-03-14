import React from 'react';
import { formatRupiah } from '../../utils/currency';

interface Props {
  monthLabel: string;
  total: number;
  perPaidBy: Record<string, number>;
}

export const ExpenseSummary: React.FC<Props> = ({ monthLabel, total, perPaidBy }) => {
  return (
    <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-3">
      <div>
        <div className="text-xs text-gray-500">{monthLabel}</div>
        <div className="text-lg font-semibold">Total bulan ini</div>
        <div className="text-xl font-bold">{formatRupiah(total)}</div>
      </div>
      <div className="border-t border-gray-100 pt-2">
        <div className="text-xs font-medium mb-1">Per orang</div>
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
          {Object.entries(perPaidBy).map(([name, amount]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span className="font-semibold">{formatRupiah(amount || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

