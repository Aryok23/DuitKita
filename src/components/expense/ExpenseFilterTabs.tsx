import React from 'react';
import type { PaidBy } from '../../models/expense';

type Filter = 'All' | PaidBy;

const filters: Filter[] = ['All', 'Ibu', 'Rosita', 'Aryo', 'Shafa', 'Together'];

interface Props {
  value: Filter;
  onChange: (value: Filter) => void;
}

export const ExpenseFilterTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map((f) => {
        const active = value === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              active ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};

