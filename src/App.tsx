import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from './state/useAuth';
import { useNetworkStatus } from './state/useNetworkStatus';
import { getCurrentMonth } from './utils/date';
import { ExpenseCard } from './components/expense/ExpenseCard';
import { ExpenseFilterTabs } from './components/expense/ExpenseFilterTabs';
import { ExpenseSummary } from './components/expense/ExpenseSummary';
import { PrimaryButton } from './components/ui/PrimaryButton';
import { db } from './db/indexedDb';
import type { Expense } from './models/expense';
import { apiGetExpenses, apiGetSummary, type SummaryData } from './services/api';
import { runSync } from './services/sync';
import { ExpenseForm } from './components/expense/ExpenseForm';

type Filter = 'All' | Expense['paidBy'];

const monthLabelIntl = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric'
});

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-').map((x) => Number(x));
  const d = new Date(year, month - 1, 1);
  return monthLabelIntl.format(d);
}

function shiftMonth(ym: string, delta: number): string {
  const [year, month] = ym.split('-').map((x) => Number(x));
  const d = new Date(year, month - 1 + delta, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const App: React.FC = () => {
  const { unlocked, unlock, error: pinError } = useAuth();
  const { online } = useNetworkStatus();

  const [pin, setPin] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [month, setMonth] = useState<string>(() => getCurrentMonth());
  const monthLabel = useMemo(() => formatMonthLabel(month), [month]);

  useEffect(() => {
    if (!unlocked) return;

    async function load() {
      setLoading(true);
      try {
        if (online) {
          await runSync();
          const [expRes, sumRes] = await Promise.all([
            apiGetExpenses(month),
            apiGetSummary(month)
          ]);
          setExpenses(expRes.expenses);
          setSummary(sumRes);
          await db.expenses.where('month').equals(month).delete();
          await db.expenses.bulkAdd(
            expRes.expenses.map((e) => ({ ...e, month, isPending: false, isDeleted: false }))
          );
        } else {
          const local = await db.expenses.where('month').equals(month).toArray();
          setExpenses(local.filter((e) => !e.isDeleted));
          if (!summary) {
            const total = local.reduce((acc, e) => acc + e.amount, 0);
            const perPaidBy: Record<string, number> = {
              Ibu: 0,
              Rosita: 0,
              Aryo: 0,
              Shafa: 0,
              Together: 0
            };
            local.forEach((e) => {
              if (perPaidBy[e.paidBy] != null) perPaidBy[e.paidBy] += e.amount;
            });
            setSummary({
              month,
              total,
              perPaidBy,
              perCategory: {}
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [unlocked, online, month]);

  useEffect(() => {
    if (!unlocked || !online) return;
    void runSync();
  }, [unlocked, online]);

  const filteredExpenses = useMemo(() => {
    if (filter === 'All') return expenses.filter((e) => !e.isDeleted);
    return expenses.filter((e) => e.paidBy === filter && !e.isDeleted);
  }, [expenses, filter]);

  async function handleAdd(fields: {
    amount: number;
    item: string;
    category: Expense['category'];
    paymentMethod: Expense['paymentMethod'];
    date: string;
    paidBy: Expense['paidBy'];
  }) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const monthValue = fields.date.slice(0, 7);
    const expense: Expense = {
      ...fields,
      id,
      createdAt,
      month: monthValue,
      isPending: true,
      isDeleted: false
    };

    setExpenses((prev) => [expense, ...prev]);
    await db.expenses.put(expense);
    await db.pendingQueue.add({
      operationId: crypto.randomUUID(),
      type: 'add',
      expenseId: id,
      month: monthValue,
      payload: expense,
      createdAt,
      retryCount: 0
    });

    if (online) {
      await runSync();
    }
  }

  async function handleDelete(expense: Expense) {
    const monthValue = expense.date.slice(0, 7);
    setExpenses((prev) =>
      prev.map((e) => (e.id === expense.id ? { ...e, isDeleted: true } : e))
    );
    await db.expenses.update(expense.id, { isDeleted: true });
    await db.pendingQueue.add({
      operationId: crypto.randomUUID(),
      type: 'delete',
      expenseId: expense.id,
      month: monthValue,
      payload: { id: expense.id },
      createdAt: new Date().toISOString(),
      retryCount: 0
    });
    if (online) {
      await runSync();
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-xs bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <div>
            <div className="text-lg font-semibold text-center mb-1">DuitKita</div>
            <div className="text-xs text-gray-500 text-center">Masukkan PIN keluarga</div>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center tracking-[0.5em] text-lg"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          {pinError && <div className="text-xs text-red-500 text-center">{pinError}</div>}
          <PrimaryButton
            onClick={() => {
              void unlock(pin);
            }}
          >
            Masuk
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Bulan</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 rounded-full text-xs bg-gray-200"
              onClick={() => setMonth((prev) => shiftMonth(prev, -1))}
            >
              ‹
            </button>
            <div className="text-base font-semibold">{monthLabel}</div>
            <button
              type="button"
              className="px-2 py-1 rounded-full text-xs bg-gray-200"
              onClick={() => setMonth((prev) => shiftMonth(prev, 1))}
            >
              ›
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {online ? 'Online' : 'Offline'} {loading && ' • memuat...'}
        </div>
      </header>

      <main className="px-4 pb-24 flex-1 flex flex-col gap-4">
        {summary && (
          <ExpenseSummary
            monthLabel={monthLabel}
            total={summary.total}
            perPaidBy={summary.perPaidBy}
          />
        )}

        <ExpenseFilterTabs value={filter} onChange={setFilter} />

        <div className="flex-1 flex flex-col gap-2 mt-1 mb-2">
          {filteredExpenses.length === 0 ? (
            <div className="text-xs text-gray-400 text-center mt-8">
              Belum ada pengeluaran bulan ini.
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onDelete={() => {
                  void handleDelete(exp);
                }}
              />
            ))
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-end justify-center">
            <div className="w-full max-w-md bg-white rounded-t-2xl p-4 pb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold">Tambah pengeluaran</div>
                <button
                  className="text-xs text-gray-500"
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Tutup
                </button>
              </div>
              <ExpenseForm
                onSubmit={(fields) => {
                  void handleAdd(fields);
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
      </main>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 rounded-full bg-black text-white w-14 h-14 shadow-lg flex items-center justify-center text-2xl"
        aria-label="Tambah pengeluaran"
      >
        +
      </button>
    </div>
  );
};

export default App;

