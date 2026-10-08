/**
 * src/lib/api.ts
 * Central API client for Overclock backend.
 *
 * Usage:
 *   import { getDashboard, addExpense } from '@/lib/api';
 *
 * The user_id is read from localStorage (set during character creation).
 * Base URL is set via NEXT_PUBLIC_API_BASE_URL in .env.local
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api/backend';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getUserId(): number {
  if (typeof window === 'undefined') return 0; // SSR guard
  const id = localStorage.getItem('nyx_user_id');
  if (!id) throw new Error('No user_id — complete character setup first.');
  return parseInt(id, 10);
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }

  // 204 No Content (DELETE) returns empty body
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  username: string;
  character_name: string;
  character_class: string;
  avatar_style: string;
  avatar_color: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  gold: number;
  hp: number;
  max_hp: number;
  rank: string;
  world_name: string;
  streak_count: number;
  longest_streak: number;
}

export interface ApiDashboard {
  character_name: string;
  character_class: string;
  avatar_style: string;
  avatar_color: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  gold: number;
  hp: number;
  max_hp: number;
  world_name: string;
  rank: string;
  streak_count: number;
  longest_streak: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  savings_rate: number;
  total_invested: number;
  total_investment_value: number;
  investment_profit_loss: number;
  budgets: ApiBudget[];
  active_goals: ApiGoal[];
  completed_goals: number;
  todays_quests: ApiQuest[];
  monthly_challenge: ApiChallenge | null;
  unread_notifications: number;
}

export interface ApiIncome {
  id: number;
  source_name: string;
  amount: number;
  income_type: string;
  date_received: string;
  is_recurring: boolean;
  notes: string | null;
}

export interface ApiExpense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date_spent: string;
  payment_method: string;
  notes: string | null;
}

export interface ApiBudget {
  id: number;
  category: string;
  monthly_limit: number;
  current_spent: number;
  remaining: number;
  usage_percent: number;
  is_over_budget: boolean;
}

export interface ApiGoal {
  id: number;
  name: string;
  icon: string;
  target_amount: number;
  current_amount: number;
  progress_percent: number;
  deadline: string | null;
}

export interface ApiQuest {
  id: number;
  name: string;
  description: string;
  icon: string;
  gold_reward: number;
  xp_reward: number;
  is_completed: boolean;
}

export interface ApiChallenge {
  id: number;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  progress_percent: number;
  is_completed: boolean;
  gold_reward: number;
  xp_reward: number;
}

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  icon: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

// ── Character class mapping ───────────────────────────────────────────────────
// Maps frontend character IDs → backend CharacterClass enum values

export const CHARACTER_CLASS_MAP: Record<string, string> = {
  vanguard:   'warrior',
  pathfinder: 'ranger',
  ranger:     'ranger',
  shadow:     'ranger',
  mystic:     'mage',
  sorcerer:   'mage',
  berserker:  'warrior',
  scholar:    'mage',
  goblin:     'paladin',
};

// ── Users ─────────────────────────────────────────────────────────────────────

export interface CreateUserPayload {
  username: string;
  character_name: string;
  character_class: string;
  avatar_style?: string;
  avatar_color?: string;
  weapon_skin?: string;
  armor_skin?: string;
}

/** Called once during onboarding. Saves user_id to localStorage. */
export async function registerCharacter(payload: CreateUserPayload): Promise<ApiUser> {
  const user = await apiFetch<ApiUser>('/users/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  localStorage.setItem('nyx_user_id', String(user.id));
  return user;
}

export const getUser = () =>
  apiFetch<ApiUser>(`/users/${getUserId()}`);

// ── Dashboard ─────────────────────────────────────────────────────────────────

/** Master endpoint — returns all character + finance data in one call. */
export const getDashboard = () =>
  apiFetch<ApiDashboard>(`/users/${getUserId()}/dashboard/`);

// ── Income ───────────────────────────────────────────────────────────────────

export interface AddIncomePayload {
  source_name: string;
  amount: number;
  date_received: string;       // 'YYYY-MM-DD'
  income_type?: string;        // 'salary' | 'freelance' | 'investment' | 'other'
  is_recurring?: boolean;
  notes?: string;
}

export const getIncome = (params?: {
  from_date?: string;
  to_date?: string;
  skip?: number;
  limit?: number;
}) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  ).toString();
  return apiFetch<ApiIncome[]>(`/users/${getUserId()}/income/?${q}`);
};

export const addIncome = (data: AddIncomePayload) =>
  apiFetch(`/users/${getUserId()}/income/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteIncome = (incomeId: number) =>
  apiFetch(`/users/${getUserId()}/income/${incomeId}`, { method: 'DELETE' });

// ── Expenses ─────────────────────────────────────────────────────────────────

export interface AddExpensePayload {
  description: string;
  amount: number;
  category: string;            // 'food' | 'transport' | 'entertainment' | etc.
  date_spent: string;          // 'YYYY-MM-DD'
  payment_method?: string;
  notes?: string;
}

export const getExpenses = (params?: {
  category?: string;
  from_date?: string;
  to_date?: string;
  skip?: number;
  limit?: number;
}) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  ).toString();
  return apiFetch<ApiExpense[]>(`/users/${getUserId()}/expenses/?${q}`);
};

export const addExpense = (data: AddExpensePayload) =>
  apiFetch(`/users/${getUserId()}/expenses/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteExpense = (expenseId: number) =>
  apiFetch(`/users/${getUserId()}/expenses/${expenseId}`, { method: 'DELETE' });

// ── Budgets ──────────────────────────────────────────────────────────────────

export const getBudgets = (params?: { month?: number; year?: number }) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  ).toString();
  return apiFetch<ApiBudget[]>(`/users/${getUserId()}/budgets/?${q}`);
};

export const createBudget = (data: {
  category: string;
  monthly_limit: number;
  month: number;
  year: number;
}) =>
  apiFetch(`/users/${getUserId()}/budgets/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteBudget = (budgetId: number) =>
  apiFetch(`/users/${getUserId()}/budgets/${budgetId}`, { method: 'DELETE' });

// ── Savings Goals ────────────────────────────────────────────────────────────

export const getGoals = () =>
  apiFetch<ApiGoal[]>(`/users/${getUserId()}/goals/`);

export const createGoal = (data: {
  name: string;
  target_amount: number;
  icon?: string;
  deadline?: string;
}) =>
  apiFetch(`/users/${getUserId()}/goals/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const contributeToGoal = (goalId: number, amount: number) =>
  apiFetch(`/users/${getUserId()}/goals/${goalId}`, {
    method: 'PATCH',
    body: JSON.stringify({ current_amount: amount }),
  });

// ── Quests & Achievements ─────────────────────────────────────────────────────

export const getQuests = () =>
  apiFetch<ApiQuest[]>(`/users/${getUserId()}/quests/`);

export const getAchievements = () =>
  apiFetch(`/users/${getUserId()}/achievements/`);

// ── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = () =>
  apiFetch<ApiNotification[]>(`/users/${getUserId()}/notifications/`);

export const markNotificationRead = (notifId: number) =>
  apiFetch(`/users/${getUserId()}/notifications/${notifId}/read`, {
    method: 'PATCH',
  });

export const markAllNotificationsRead = () =>
  apiFetch(`/users/${getUserId()}/notifications/read-all`, {
    method: 'PATCH',
  });

// ── Athena AI ─────────────────────────────────────────────────────────────────

/** Triggers Gemini analysis. Takes a few seconds — show a loading spinner. */
export const runAthenaAnalysis = () =>
  apiFetch(`/users/${getUserId()}/ai/analyze`, { method: 'POST' });

/** Returns the saved monthly AI report. Call after runAthenaAnalysis. */
export const getAIReport = () =>
  apiFetch(`/users/${getUserId()}/ai/report`);

// ── Investments ───────────────────────────────────────────────────────────────

export const getInvestments = (params?: { skip?: number; limit?: number }) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  ).toString();
  return apiFetch<unknown[]>(`/users/${getUserId()}/investments/?${q}`);
};

// ── Health check ─────────────────────────────────────────────────────────────

export const healthCheck = () =>
  apiFetch<{ status: string }>('/health');
