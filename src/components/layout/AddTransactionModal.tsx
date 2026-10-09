'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function AddTransactionModal() {
  const { isAddTransactionOpen, setAddTransactionOpen, addTransaction } = useAppStore();

  const [entity, setEntity] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAddTransactionOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity || !amount || isSaving) return;

    let icon = 'shopping_cart';
    if (category === 'Salary') icon = 'work';
    if (category === 'Utilities') icon = 'bolt';
    if (category === 'Entertainment') icon = 'sports_esports';
    if (category === 'Transfer') icon = 'payments';
    if (category === 'Consumables') icon = 'coffee';

    try {
      setIsSaving(true);
      setError(null);
      await addTransaction({
        entity,
        category,
        amount: parseFloat(amount),
        type,
        date: 'Just now',
        icon
      });

      setEntity('');
      setAmount('');
      setAddTransactionOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1a1a1a] border-[3px] border-black brutalist-shadow p-6 relative">
        <button
          onClick={() => setAddTransactionOpen(false)}
          className="absolute top-4 right-4 text-[#eeeeee] hover:text-[#cb2957] p-1 font-mono font-bold"
        >
          ✕
        </button>

        <h2 className="font-space text-2xl font-bold uppercase text-white mb-1 border-b-[3px] border-black pb-2">
          + ADD TRANSACTION
        </h2>
        <p className="font-mono text-xs text-[#c6c6c6] mb-6">
          Log spending or income to earn +25 XP
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#93000a] border-[2px] border-black p-3 font-mono text-xs text-white">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Entity / Name</label>
            <input
              type="text"
              required
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder="e.g. Cyber Cafe, Megacorp"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'debit' | 'credit')}
                className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
              >
                <option value="debit">DEBIT (-)</option>
                <option value="credit">CREDIT (+)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
              >
                <option value="Groceries">Groceries</option>
                <option value="Salary">Salary</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Consumables">Consumables</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-4 bg-[#cb2957] text-white font-space text-lg font-bold uppercase py-3 border-[3px] border-black brutalist-shadow hover:bg-[#ffb2bd] hover:text-black transition-colors"
          >
            {isSaving ? 'SYNCING...' : 'CONFIRM TRANSACTION'}
          </button>
        </form>
      </div>
    </div>
  );
}
