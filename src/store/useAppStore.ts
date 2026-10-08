import { create } from 'zustand';

export interface Character {
  id: string;
  name: string;
  classTitle: string;
  imageUrl?: string;
  spriteBgPos: string;
  spriteBgSize: string;
  str: number;
  wis: number;
  dex: number;
  con: number;
}

export interface Transaction {
  id: string;
  icon: string;
  entity: string;
  category: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface Quest {
  id: string;
  title: string;
  estCompletion: string;
  imageUrl: string;
  currentAmount: number;
  targetAmount: number;
  status: 'IN PROGRESS' | 'NEAR COMPLETION' | 'COMPLETED';
}

export interface Budget {
  id: string;
  category: string;
  icon: string;
  spent: number;
  limit: number;
  status: 'normal' | 'warning' | 'optimal';
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  xp_reward: number;
  gold_reward: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface LinkedTool {
  id: string;
  name: string;
  effect: string;
  icon: string;
}

export interface AnalyticsDonutSlice {
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface AnalyticsBarPoint {
  quarter: string;
  Inflow: number;
  Outflow: number;
}

export type ApiStatus = 'idle' | 'loading' | 'ready' | 'error';

const DEFAULT_ACCENT_COLOR = '#cb2957';

interface DashboardBudgetResponse {
  id: number;
  category: string;
  monthly_limit: number;
  current_spent: number;
  usage_percent: number;
}

interface DashboardGoalResponse {
  id: number;
  name: string;
  deadline: string | null;
  progress_percent: number;
  current_amount: number;
  target_amount: number;
}

interface DashboardResponse {
  character_name: string;
  character_class: string;
  avatar_style?: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak_count: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  savings_rate: number;
  investment_profit_loss: number;
  budgets: DashboardBudgetResponse[];
  active_goals: DashboardGoalResponse[];
}

interface ExpenseResponse {
  id: number;
  amount: number;
  category: string;
  description: string | null;
  date_spent: string;
}

interface IncomeResponse {
  id: number;
  name: string;
  amount: number;
  income_type: string;
  date_received: string;
}

interface AchievementDefinitionResponse {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  xp_reward: number;
  gold_reward: number;
}

interface UserAchievementResponse {
  achievement: AchievementDefinitionResponse;
  unlocked_at: string;
}

interface MonthlyReportResponse {
  ai_summary?: string | null;
  spending_insights?: string[] | null;
  saving_suggestions?: string[] | null;
  budget_recommendations?: string[] | null;
}

interface AthenaAnalysisResponse {
  success: boolean;
  data?: {
    athena_message?: string;
    spending_summary?: string;
    monthly_insights?: string[];
    saving_suggestions?: string[];
    quest_tip?: string;
  };
}

export interface AppState {
  // User & Level Info
  agentName: string;
  agentClass: string;
  level: number;
  xp: number;
  maxXp: number;
  streakDays: number;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  customCursorEnabled: boolean;
  isSidebarCollapsed: boolean;
  apiStatus: ApiStatus;
  apiError?: string;
  userId?: number;
  accentColor: string;

  // Selected Avatar
  selectedCharacter: Character;

  // Transactions, Quests, Budgets
  transactions: Transaction[];
  quests: Quest[];
  budgets: Budget[];
  achievements: Achievement[];
  linkedTools: LinkedTool[];
  analyticsDonutData: AnalyticsDonutSlice[];
  analyticsBarData: AnalyticsBarPoint[];
  tacticalInsights: string[];
  athenaInsight: string;
  isAthenaInsightLoading: boolean;

  // Modals / Triggers
  isAddTransactionOpen: boolean;
  isAddBudgetOpen: boolean;
  isAddGoalOpen: boolean;

  // Actions
  setAgentName: (name: string) => void;
  setSelectedCharacter: (character: Character) => void;
  setAccentColor: (color: string) => void;
  hydrateDeviceAccent: () => void;
  hydrateLinkedTools: () => void;
  addLinkedTool: (tool: Omit<LinkedTool, 'id'>) => void;
  removeLinkedTool: (id: string) => void;
  toggleCustomCursor: () => void;
  toggleSidebar: () => void;
  setAddTransactionOpen: (open: boolean) => void;
  setAddBudgetOpen: (open: boolean) => void;
  setAddGoalOpen: (open: boolean) => void;
  loadBackendData: () => Promise<void>;
  loginUser: (username: string) => Promise<boolean>;
  createCurrentUser: (username: string) => Promise<void>;
  loadAthenaInsight: () => Promise<void>;
  logout: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  createBudget: (data: { category: string; monthly_limit: number; month: number; year: number }) => Promise<void>;
  createGoal: (data: { name: string; target_amount: number; deadline?: string; icon?: string }) => Promise<void>;
  contributeQuest: (questId: string, amount: number) => Promise<void>;
}

export const CHARACTERS: Character[] = [
  {
    id: 'vanguard',
    name: 'VANGUARD',
    classTitle: 'Fiscal Vanguard',
    imageUrl: '/characters/vanguard.png',
    spriteBgPos: '4% 1%',
    spriteBgSize: '360% 360%',
    str: 85,
    wis: 90,
    dex: 65,
    con: 80
  },
  {
    id: 'pathfinder',
    name: 'PATHFINDER',
    classTitle: 'Torch Navigator',
    imageUrl: '/characters/pathfinder.png',
    spriteBgPos: '50% 1%',
    spriteBgSize: '360% 360%',
    str: 70,
    wis: 85,
    dex: 90,
    con: 60
  },
  {
    id: 'ranger',
    name: 'RANGER',
    classTitle: 'Asset Archer',
    imageUrl: '/characters/ranger.png',
    spriteBgPos: '96% 1%',
    spriteBgSize: '360% 360%',
    str: 75,
    wis: 78,
    dex: 95,
    con: 55
  },
  {
    id: 'shadow',
    name: 'SHADOW',
    classTitle: 'Ledger Operative',
    imageUrl: '/characters/shadow.png',
    spriteBgPos: '4% 48%',
    spriteBgSize: '360% 360%',
    str: 65,
    wis: 95,
    dex: 92,
    con: 50
  },
  {
    id: 'mystic',
    name: 'MYSTIC',
    classTitle: 'Yield Witch',
    imageUrl: '/characters/mystic.png',
    spriteBgPos: '50% 48%',
    spriteBgSize: '360% 360%',
    str: 60,
    wis: 99,
    dex: 75,
    con: 40
  },
  {
    id: 'sorcerer',
    name: 'SORCERER',
    classTitle: 'Capital Mage',
    imageUrl: '/characters/sorcerer.png',
    spriteBgPos: '96% 48%',
    spriteBgSize: '360% 360%',
    str: 55,
    wis: 96,
    dex: 80,
    con: 45
  },
  {
    id: 'berserker',
    name: 'BERSERKER',
    classTitle: 'Debt Destroyer',
    imageUrl: '/characters/berserker.png',
    spriteBgPos: '4% 96%',
    spriteBgSize: '360% 360%',
    str: 95,
    wis: 70,
    dex: 60,
    con: 90
  },
  {
    id: 'scholar',
    name: 'SCHOLAR',
    classTitle: 'Vault Monk',
    imageUrl: '/characters/scholar.png',
    spriteBgPos: '50% 96%',
    spriteBgSize: '360% 360%',
    str: 50,
    wis: 98,
    dex: 70,
    con: 65
  },
  {
    id: 'goblin',
    name: 'GOBLIN',
    classTitle: 'Coin Hoarder',
    imageUrl: '/characters/goblin.png',
    spriteBgPos: '96% 96%',
    spriteBgSize: '360% 360%',
    str: 80,
    wis: 82,
    dex: 90,
    con: 75
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/backend';
const STORAGE_USER_ID = 'nyx_user_id';
const STORAGE_ACCENT = 'nyx_accent_color';
const STORAGE_LINKED_TOOLS = 'nyx_linked_tools';

const questImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2i3SHRGOPrU-uS4m1HBKP-mDWj7CCZTDj8NH9QoxKGuv4camlnq8YTEwEgCW3PXy2jeV2sjm6ZfJTHnA297_giP7sX54pEAuQmIQ2b98HGFzEo-MI6dSJ52jERKFZTC_2eyU4WcmyIX1jFRmvtWNRhkghoS8X4KM2hGrSIV9IVNuju8tye8GpptXPpnhxEOpHyeZeN6DfJ0JBYtuE-TRUkmE9dunq4nDZdNigH1D-TJ74OVOChyJtNg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAXf2eaQOemu4A4ukBlG-iY-rPR8fQ4zDU7Z8uBxKN7trI66fXfm6kHi-xzHOMAqcOq1NwlxSVEAm9UJUvCbRRKdrExdmSXsqRIORYDe7AlmGnARKwOAEBx6Xk5WDji2Uhx_FGBMv7pNDj85sERCIiPEhdGeeJZUpBELHtcFxtp88zoemqyauuA-yg7D_GdT0kc1-RxXs5rfLIZerSEj2jGyIsGNjWe_mKG9GvWjydjwLDPAcvywtmWnw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lODqDOGXOcFNv9uULdKwY6wiW-CqS6gDf2msVBvkIJG5gfSSgItWzgokEATFWSUFAm41zsyWi2h0GDD7Jh3VDEslsOU2wUulZ64-sQYUyPi1AjMF_EdkUGbRvgz79pMw6pSvKXmNV3vor24uUl2yBQeok6oiGqg9QBfFJJGQRr711edX5CAe_6Xlc02xF2q8BErS3XcsglWoZFxL0z_JNiLCvlACPy0uswrhNa4LxN5kUnbve9yu_g',
];

const characterClassById: Record<string, string> = {
  vanguard: 'warrior',
  pathfinder: 'ranger',
  ranger: 'ranger',
  shadow: 'ranger',
  mystic: 'mage',
  sorcerer: 'mage',
  berserker: 'warrior',
  scholar: 'mage',
  goblin: 'paladin',
};

const categoryIcons: Record<string, string> = {
  bills: 'bolt',
  rent: 'home',
  goal_purchase: 'savings',
  useless: 'warning',
  food: 'restaurant',
  transport: 'directions_car',
  health: 'health_and_safety',
  entertainment: 'sports_esports',
  subscription: 'subscriptions',
  savings: 'savings',
  investments: 'memory',
  other: 'payments',
};

const categoryLabels: Record<string, string> = {
  bills: 'Utilities',
  rent: 'Shelter',
  goal_purchase: 'Goal Purchase',
  useless: 'Impulse',
  food: 'Food & Sustenance',
  transport: 'Transit',
  health: 'Health',
  entertainment: 'Entertainment',
  subscription: 'Subscriptions',
  savings: 'Savings',
  investments: 'Upgrades',
  other: 'Other',
};

const categoryAnalyticsColors = [
  '#cb2957',
  '#77da9f',
  '#c6c6c6',
  '#ffb2bd',
  '#f7b731',
  '#3867d6',
  '#00b894',
  '#8e44ad',
  '#e17055',
  '#74b9ff',
];

const expenseCategoryByLabel: Record<string, string> = {
  Groceries: 'food',
  Salary: 'other',
  Utilities: 'bills',
  Entertainment: 'entertainment',
  Consumables: 'food',
  Transfer: 'other',
};

const toIsoDate = () => new Date().toISOString().slice(0, 10);

const monthKey = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const label = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return { key, label };
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((midnight.getTime() - date.getTime()) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const findCharacterForBackend = (dashboard: { avatar_style?: string; character_class?: string }) => {
  return (
    CHARACTERS.find((character) => character.id === dashboard.avatar_style) ||
    CHARACTERS.find((character) => character.id === 'vanguard') ||
    CHARACTERS[0]
  );
};

const applyAccentColor = (color: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--primary-container', color);
  document.documentElement.style.setProperty('--accent-magenta', color);
};

const readLinkedTools = (): LinkedTool[] => {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_LINKED_TOOLS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LinkedTool[];
    return Array.isArray(parsed)
      ? parsed.filter((tool) => tool.id && tool.name && tool.effect && tool.icon)
      : [];
  } catch {
    return [];
  }
};

const writeLinkedTools = (tools: LinkedTool[]) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_LINKED_TOOLS, JSON.stringify(tools));
  }
};

const buildAnalyticsDonutData = (expenses: ExpenseResponse[]): AnalyticsDonutSlice[] => {
  const totals = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});
  const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  if (total <= 0) return [];

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount], index) => ({
      name: (categoryLabels[category] || category).toUpperCase(),
      value: Math.round((amount / total) * 100),
      amount,
      color: categoryAnalyticsColors[index % categoryAnalyticsColors.length],
    }));
};

const buildAnalyticsBarData = (expenses: ExpenseResponse[], income: IncomeResponse[]): AnalyticsBarPoint[] => {
  const monthly = new Map<string, AnalyticsBarPoint>();

  const ensureMonth = (value: string) => {
    const { key, label } = monthKey(value);
    if (!monthly.has(key)) {
      monthly.set(key, { quarter: label, Inflow: 0, Outflow: 0 });
    }
    return monthly.get(key)!;
  };

  income.forEach((item) => {
    ensureMonth(item.date_received).Inflow += Number(item.amount);
  });
  expenses.forEach((expense) => {
    ensureMonth(expense.date_spent).Outflow += Number(expense.amount);
  });

  return Array.from(monthly.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, point]) => ({
      ...point,
      Inflow: Number(point.Inflow.toFixed(2)),
      Outflow: Number(point.Outflow.toFixed(2)),
    }));
};

const buildTacticalInsights = (
  dashboard: DashboardResponse,
  income: IncomeResponse[],
  budgets: Budget[],
  quests: Quest[],
  donutData: AnalyticsDonutSlice[],
  barData: AnalyticsBarPoint[]
) => {
  const insights: string[] = [];
  const largestCategory = donutData[0];
  const exceededBudget = budgets.find((budget) => budget.spent > budget.limit);
  const bestGoal = quests
    .filter((quest) => quest.targetAmount > 0)
    .map((quest) => ({ title: quest.title, progress: (quest.currentAmount / quest.targetAmount) * 100 }))
    .sort((a, b) => b.progress - a.progress)[0];
  const highestExpenseMonth = [...barData].sort((a, b) => b.Outflow - a.Outflow)[0];
  const highestIncomeMonth = [...barData].sort((a, b) => b.Inflow - a.Inflow)[0];

  if (largestCategory) {
    insights.push(`Largest spending category is ${largestCategory.name} at ${largestCategory.value}% of logged expenses.`);
  } else {
    insights.push('No expenses logged yet; resource allocation will activate after the first expense.');
  }

  insights.push(
    `Net cash flow is ${dashboard.net_savings >= 0 ? 'positive' : 'negative'} at $${Math.abs(dashboard.net_savings).toLocaleString('en-US', { maximumFractionDigits: 2 })}, with a ${dashboard.savings_rate.toFixed(1)}% savings rate.`
  );

  if (exceededBudget) {
    insights.push(`${exceededBudget.category} budget is exceeded by $${(exceededBudget.spent - exceededBudget.limit).toLocaleString('en-US', { maximumFractionDigits: 2 })}.`);
  } else if (budgets.length) {
    insights.push('No current budgets are exceeded.');
  } else {
    insights.push('No budgets configured yet; add a budget to unlock limit tracking.');
  }

  if (highestExpenseMonth && highestExpenseMonth.Outflow > 0) {
    insights.push(`Highest expense month in the current history is ${highestExpenseMonth.quarter} at $${highestExpenseMonth.Outflow.toLocaleString('en-US', { maximumFractionDigits: 2 })}.`);
  }

  if (highestIncomeMonth && highestIncomeMonth.Inflow > 0 && income.length) {
    insights.push(`Highest income month in the current history is ${highestIncomeMonth.quarter} at $${highestIncomeMonth.Inflow.toLocaleString('en-US', { maximumFractionDigits: 2 })}.`);
  }

  if (bestGoal) {
    insights.push(`${bestGoal.title} is the leading goal at ${Math.round(bestGoal.progress)}% progress.`);
  } else {
    insights.push('No active goals available for progress analysis.');
  }

  if (dashboard.investment_profit_loss !== 0) {
    insights.push(`Investment growth is ${dashboard.investment_profit_loss >= 0 ? 'up' : 'down'} $${Math.abs(dashboard.investment_profit_loss).toLocaleString('en-US', { maximumFractionDigits: 2 })}.`);
  }

  return insights.slice(0, 5);
};

const buildAthenaInsightFromReport = (report: MonthlyReportResponse) => {
  const parts = [
    report.ai_summary,
    report.spending_insights?.[0],
    report.saving_suggestions?.[0],
    report.budget_recommendations?.[0],
  ].filter(Boolean);

  return parts.length ? `Athena says: ${parts.slice(0, 2).join(' ')}` : '';
};

const buildAthenaInsightFromAnalysis = (analysis: AthenaAnalysisResponse) => {
  const data = analysis.data;
  if (!data) return '';

  return (
    data.athena_message ||
    [data.spending_summary, data.monthly_insights?.[0], data.saving_suggestions?.[0], data.quest_tip]
      .filter(Boolean)
      .slice(0, 2)
      .join(' ')
  );
};

const buildLocalAthenaInsight = (state: AppState) => {
  if (state.tacticalInsights.length) {
    return `Athena says: ${state.tacticalInsights[0]}`;
  }

  if (state.totalIncome || state.totalExpenses || state.quests.length) {
    return `Athena says: net cash flow is $${state.netSavings.toLocaleString('en-US', { maximumFractionDigits: 2 })} with a ${state.savingsRate.toFixed(1)}% savings rate.`;
  }

  return 'Athena will share spend, behavior, and past-experience insights after you log income, expenses, or goals.';
};

export const useAppStore = create<AppState>((set, get) => ({
  agentName: 'Guest',
  agentClass: 'Fiscal Vanguard',
  level: 0,
  xp: 0,
  maxXp: 100,
  streakDays: 0,
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  netSavings: 0,
  savingsRate: 0,
  customCursorEnabled: true,
  isSidebarCollapsed: false,
  apiStatus: 'idle',
  accentColor: DEFAULT_ACCENT_COLOR,

  selectedCharacter: CHARACTERS[0],

  transactions: [],

  quests: [],

  budgets: [],

  achievements: [],
  linkedTools: [],
  analyticsDonutData: [],
  analyticsBarData: [],
  tacticalInsights: [],
  athenaInsight: '',
  isAthenaInsightLoading: false,

  isAddTransactionOpen: false,
  isAddBudgetOpen: false,
  isAddGoalOpen: false,

  setAgentName: (name) => set({ agentName: name }),
  setSelectedCharacter: (character) => set({ selectedCharacter: character, agentClass: character.classTitle }),
  setAccentColor: (color) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_ACCENT, color);
    applyAccentColor(color);
    set({ accentColor: color });
  },
  hydrateDeviceAccent: () => {
    const storedAccent = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ACCENT) : null;
    const accentColor = storedAccent || DEFAULT_ACCENT_COLOR;
    applyAccentColor(accentColor);
    set({ accentColor });
  },
  hydrateLinkedTools: () => {
    set({ linkedTools: readLinkedTools() });
  },
  addLinkedTool: (tool) => {
    set((state) => {
      const linkedTools = [
        ...state.linkedTools,
        {
          ...tool,
          id: `tool-${Date.now()}`,
          name: tool.name.trim(),
          effect: tool.effect.trim(),
          icon: tool.icon.trim() || 'extension',
        },
      ];
      writeLinkedTools(linkedTools);
      return { linkedTools };
    });
  },
  removeLinkedTool: (id) => {
    set((state) => {
      const linkedTools = state.linkedTools.filter((tool) => tool.id !== id);
      writeLinkedTools(linkedTools);
      return { linkedTools };
    });
  },
  toggleCustomCursor: () => set((state) => ({ customCursorEnabled: !state.customCursorEnabled })),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setAddTransactionOpen: (open) => set({ isAddTransactionOpen: open }),
  setAddBudgetOpen: (open) => set({ isAddBudgetOpen: open }),
  setAddGoalOpen: (open) => set({ isAddGoalOpen: open }),

  loadBackendData: async () => {
    try {
      set({ apiStatus: 'loading', apiError: undefined });
      const storedAccent = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ACCENT) : null;
      if (storedAccent) {
        applyAccentColor(storedAccent);
        set({ accentColor: storedAccent });
      }
      const storedUserId = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_USER_ID) : null;
      if (!storedUserId) {
        set({ apiStatus: 'ready' });
        return;
      }
      const userId = Number(storedUserId);
      const [dashboard, expenses, income, achievementDefinitions, unlockedAchievements] = await Promise.all([
        apiFetch<DashboardResponse>(`/users/${userId}/dashboard/`),
        apiFetch<ExpenseResponse[]>(`/users/${userId}/expenses/`),
        apiFetch<IncomeResponse[]>(`/users/${userId}/income/`),
        apiFetch<AchievementDefinitionResponse[]>('/achievements'),
        apiFetch<UserAchievementResponse[]>(`/users/${userId}/achievements`),
      ]);

      const selectedCharacter = findCharacterForBackend(dashboard);
      const unlockedById = new Map(
        unlockedAchievements.map((item) => [item.achievement.id, item.unlocked_at])
      );
      const achievements = achievementDefinitions.map((achievement) => ({
        ...achievement,
        unlocked: unlockedById.has(achievement.id),
        unlocked_at: unlockedById.get(achievement.id) || null,
      }));
      const debitTransactions: Transaction[] = expenses.map((expense) => ({
        id: `expense-${expense.id}`,
        icon: categoryIcons[expense.category] || 'shopping_cart',
        entity: expense.description || categoryLabels[expense.category] || 'Expense',
        category: categoryLabels[expense.category] || expense.category,
        date: formatDate(expense.date_spent),
        amount: Number(expense.amount),
        type: 'debit',
      }));
      const creditTransactions: Transaction[] = income.map((item) => ({
        id: `income-${item.id}`,
        icon: item.income_type === 'regular' ? 'work' : 'payments',
        entity: item.name,
        category: item.income_type === 'regular' ? 'Salary' : 'Transfer',
        date: formatDate(item.date_received),
        amount: Number(item.amount),
        type: 'credit',
      }));

      const transactions = [...debitTransactions, ...creditTransactions].sort((a, b) => {
        if (a.date === 'Today') return -1;
        if (b.date === 'Today') return 1;
        if (a.date === 'Yesterday') return -1;
        if (b.date === 'Yesterday') return 1;
        return 0;
      });
      const budgets = dashboard.budgets.map((budget) => {
        const usage = Number(budget.usage_percent);
        return {
          id: String(budget.id),
          category: categoryLabels[budget.category] || budget.category,
          icon: categoryIcons[budget.category] || 'account_balance_wallet',
          spent: Number(budget.current_spent),
          limit: Number(budget.monthly_limit),
          status: usage >= 90 ? 'warning' as const : usage <= 50 ? 'optimal' as const : 'normal' as const,
        };
      });
      const quests = dashboard.active_goals.map((goal, index) => {
        const pct = Number(goal.progress_percent);
        return {
          id: String(goal.id),
          title: goal.name,
          estCompletion: goal.deadline
            ? new Date(`${goal.deadline}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
            : 'NO DEADLINE',
          imageUrl: questImages[index % questImages.length],
          currentAmount: Number(goal.current_amount),
          targetAmount: Number(goal.target_amount),
          status: pct >= 100 ? 'COMPLETED' as const : pct >= 85 ? 'NEAR COMPLETION' as const : 'IN PROGRESS' as const,
        };
      });
      const analyticsDonutData = buildAnalyticsDonutData(expenses);
      const analyticsBarData = buildAnalyticsBarData(expenses, income);
      const tacticalInsights = buildTacticalInsights(
        dashboard,
        income,
        budgets,
        quests,
        analyticsDonutData,
        analyticsBarData
      );

      set({
        userId,
        agentName: dashboard.character_name,
        agentClass: selectedCharacter.classTitle,
        level: dashboard.level,
        xp: dashboard.xp,
        maxXp: dashboard.xp_to_next_level,
        streakDays: dashboard.streak_count,
        totalBalance: dashboard.net_savings,
        totalIncome: dashboard.total_income,
        totalExpenses: dashboard.total_expenses,
        netSavings: dashboard.net_savings,
        savingsRate: dashboard.savings_rate,
        selectedCharacter,
        transactions,
        achievements,
        budgets,
        quests,
        analyticsDonutData,
        analyticsBarData,
        tacticalInsights,
        apiStatus: 'ready',
      });
    } catch (error) {
      set({
        apiStatus: 'error',
        apiError: error instanceof Error ? error.message : 'Unable to load backend data',
      });
    }
  },

  loginUser: async (username) => {
    const users = await apiFetch<Array<{ id: number; username: string }>>('/users/');
    const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) return false;
    localStorage.setItem(STORAGE_USER_ID, String(user.id));
    await useAppStore.getState().loadBackendData();
    return true;
  },

  createCurrentUser: async (username) => {
    const state = useAppStore.getState();
    const user = await apiFetch<{ id: number }>('/users/', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        character_name: username.trim(),
        character_class: characterClassById[state.selectedCharacter.id] || 'warrior',
        avatar_style: state.selectedCharacter.id,
        avatar_color: state.accentColor,
        weapon_skin: 'starter_kit',
        armor_skin: 'classic_outfit',
      }),
    });
    localStorage.setItem(STORAGE_USER_ID, String(user.id));
    localStorage.setItem(STORAGE_ACCENT, state.accentColor);
    await useAppStore.getState().loadBackendData();
  },

  loadAthenaInsight: async () => {
    if (get().isAthenaInsightLoading) return;

    let userId = get().userId;
    if (!userId) {
      await get().loadBackendData();
      userId = get().userId;
    }

    if (!userId) {
      set({ athenaInsight: buildLocalAthenaInsight(get()) });
      return;
    }

    set({ isAthenaInsightLoading: true });

    try {
      let athenaInsight = '';

      try {
        const report = await apiFetch<MonthlyReportResponse>(`/users/${userId}/ai/report`);
        athenaInsight = buildAthenaInsightFromReport(report);
      } catch {
        const analysis = await apiFetch<AthenaAnalysisResponse>(`/users/${userId}/ai/analyze`, {
          method: 'POST',
        });
        athenaInsight = buildAthenaInsightFromAnalysis(analysis);
      }

      set({
        athenaInsight: athenaInsight || buildLocalAthenaInsight(get()),
        isAthenaInsightLoading: false,
      });
    } catch {
      set({
        athenaInsight: buildLocalAthenaInsight(get()),
        isAthenaInsightLoading: false,
      });
    }
  },

  logout: () => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_USER_ID);
    set({
      userId: undefined,
      agentName: 'Guest',
      level: 0,
      xp: 0,
      maxXp: 100,
      streakDays: 0,
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      savingsRate: 0,
      transactions: [],
      quests: [],
      budgets: [],
      achievements: [],
      analyticsDonutData: [],
      analyticsBarData: [],
      tacticalInsights: [],
      athenaInsight: '',
      isAthenaInsightLoading: false,
      apiStatus: 'ready',
    });
  },

  addTransaction: async (tx) => {
    const state = useAppStore.getState();
    if (!state.userId) {
      await state.loadBackendData();
    }
    const userId = useAppStore.getState().userId;
    if (!userId) return;

    if (tx.type === 'credit') {
      await apiFetch(`/users/${userId}/income/`, {
        method: 'POST',
        body: JSON.stringify({
          name: tx.entity,
          amount: tx.amount,
          income_type: tx.category === 'Salary' ? 'regular' : 'miscellaneous',
          description: tx.category,
          date_received: toIsoDate(),
          is_recurring: tx.category === 'Salary',
        }),
      });
    } else {
      await apiFetch(`/users/${userId}/expenses/`, {
        method: 'POST',
        body: JSON.stringify({
          amount: tx.amount,
          category: expenseCategoryByLabel[tx.category] || 'other',
          description: tx.entity,
          date_spent: toIsoDate(),
          is_automated: false,
        }),
      });
    }

    await useAppStore.getState().loadBackendData();
  },

  createBudget: async (data) => {
    const state = useAppStore.getState();
    if (!state.userId) {
      await state.loadBackendData();
    }
    const userId = useAppStore.getState().userId;
    if (!userId) return;

    await apiFetch(`/users/${userId}/budgets/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    await useAppStore.getState().loadBackendData();
  },

  createGoal: async (data) => {
    const state = useAppStore.getState();
    if (!state.userId) {
      await state.loadBackendData();
    }
    const userId = useAppStore.getState().userId;
    if (!userId) return;

    await apiFetch(`/users/${userId}/goals/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    await useAppStore.getState().loadBackendData();
  },

  contributeQuest: async (questId, amount) => {
    const state = useAppStore.getState();
    const userId = state.userId;
    const quest = state.quests.find((item) => item.id === questId);
    if (!userId || !quest || state.totalBalance <= 0) return;
    const contribution = Math.min(amount, state.totalBalance, quest.targetAmount - quest.currentAmount);

    await apiFetch(`/users/${userId}/goals/${questId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        current_amount: quest.currentAmount + contribution,
      }),
    });
    await apiFetch(`/users/${userId}/expenses/`, {
      method: 'POST',
      body: JSON.stringify({
        amount: contribution,
        category: 'goal_purchase',
        description: `Goal contribution: ${quest.title}`,
        date_spent: toIsoDate(),
        is_automated: false,
      }),
    });

    await useAppStore.getState().loadBackendData();
  }
}));
