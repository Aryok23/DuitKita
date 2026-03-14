import type { Expense } from '../models/expense';
import { API_BASE_URL } from '../utils/env';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'API error');
  }
  return json.data as T;
}

function toFormBody(params: Record<string, unknown>): URLSearchParams {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    body.append(key, String(value));
  }
  return body;
}

export async function apiAddExpense(expense: Expense): Promise<void> {
  const body = toFormBody({
    action: 'addExpense',
    ...expense
  });
  await request(API_BASE_URL, {
    method: 'POST',
    body
  });
}

export async function apiUpdateExpense(expense: Expense): Promise<void> {
  const body = toFormBody({
    action: 'updateExpense',
    ...expense
  });
  await request(API_BASE_URL, {
    method: 'POST',
    body
  });
}

export async function apiDeleteExpense(id: string, month: string): Promise<void> {
  const body = toFormBody({
    action: 'deleteExpense',
    id,
    month
  });
  await request(API_BASE_URL, {
    method: 'POST',
    body
  });
}

export interface GetExpensesResponse {
  month: string;
  expenses: Expense[];
}

export async function apiGetExpenses(month: string): Promise<GetExpensesResponse> {
  const url = `${API_BASE_URL}?action=getExpenses&month=${encodeURIComponent(month)}`;
  return request<GetExpensesResponse>(url);
}

export interface SummaryData {
  month: string;
  total: number;
  perPaidBy: Record<string, number>;
  perCategory: Record<string, number>;
}

export async function apiGetSummary(month: string): Promise<SummaryData> {
  const url = `${API_BASE_URL}?action=getSummary&month=${encodeURIComponent(month)}`;
  return request<SummaryData>(url);
}

