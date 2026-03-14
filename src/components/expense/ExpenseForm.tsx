import React, { useState } from 'react';
import type { Category, PaidBy, PaymentMethod, Expense } from '../../models/expense';
import { PrimaryButton } from '../ui/PrimaryButton';

const categories: Category[] = [
  'Food',
  'Transport',
  'Groceries',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Others'
];

const paymentMethods: PaymentMethod[] = ['Cash', 'Debit', 'm-Banking'];

const people: PaidBy[] = ['Ibu', 'Rosita', 'Aryo', 'Shafa', 'Together'];

interface Props {
  initial?: Partial<Expense>;
  onSubmit: (fields: {
    amount: number;
    item: string;
    category: Category;
    paymentMethod: PaymentMethod;
    date: string;
    paidBy: PaidBy;
  }) => void;
}

export const ExpenseForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [item, setItem] = useState(initial?.item ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial?.paymentMethod ?? 'Cash');
  const [date, setDate] = useState(initial?.date ?? today);
  const [paidBy, setPaidBy] = useState<PaidBy>(initial?.paidBy ?? 'Together');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || !item) return;
    onSubmit({
      amount: amt,
      item,
      category,
      paymentMethod,
      date,
      paidBy
    });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs mb-1">Jumlah (IDR)</label>
        <input
          type="number"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Nama item</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs mb-1">Kategori</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1">Metode bayar</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs mb-1">Tanggal</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1">Dibayar oleh</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value as PaidBy)}
          >
            {people.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <PrimaryButton type="submit" className="mt-2">
        Simpan
      </PrimaryButton>
    </form>
  );
};

