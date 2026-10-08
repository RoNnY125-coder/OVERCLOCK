'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const budgetCategories = [
  'bills',
  'rent',
  'food',
  'transport',
  'health',
  'entertainment',
  'subscription',
  'savings',
  'investments',
  'other',
];

const formatCategory = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AddBudgetModal() {
  const { isAddBudgetOpen, setAddBudgetOpen, createBudget } = useAppStore();

  const [category, setCategory] = useState('food');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAddBudgetOpen) return null;

  const resetForm = () => {
    setCategory('food');
    setMonthlyLimit('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyLimit || isSaving) return;

    const today = new Date();

    try {
      setIsSaving(true);
      setError(null);
      await createBudget({
        category,
        monthly_limit: parseFloat(monthlyLimit),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      });

      resetForm();
      setAddBudgetOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save budget');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1a1a1a] border-[3px] border-black brutalist-shadow p-6 relative">
        <button
          onClick={() => setAddBudgetOpen(false)}
          className="absolute top-4 right-4 text-[#eeeeee] hover:text-[#cb2957] p-1 font-mono font-bold"
        >
          X
        </button>

        <h2 className="font-space text-2xl font-bold uppercase text-white mb-1 border-b-[3px] border-black pb-2">
          + ADD BUDGET
        </h2>
        <p className="font-mono text-xs text-[#c6c6c6] mb-6">
          Set this month&apos;s spending limit for a category.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#93000a] border-[2px] border-black p-3 font-mono text-xs text-white">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            >
              {budgetCategories.map((item) => (
                <option key={item} value={item}>
                  {formatCategory(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Monthly Limit ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-4 bg-[#cb2957] text-white font-space text-lg font-bold uppercase py-3 border-[3px] border-black brutalist-shadow hover:bg-[#ffb2bd] hover:text-black transition-colors"
          >
            {isSaving ? 'SYNCING...' : 'CONFIRM BUDGET'}
          </button>
        </form>
      </div>
    </div>
  );
}
