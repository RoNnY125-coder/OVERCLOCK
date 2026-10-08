'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function AddGoalModal() {
  const { isAddGoalOpen, setAddGoalOpen, createGoal } = useAppStore();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAddGoalOpen) return null;

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setDeadline('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || isSaving) return;

    try {
      setIsSaving(true);
      setError(null);
      await createGoal({
        name: name.trim(),
        target_amount: parseFloat(targetAmount),
        ...(deadline ? { deadline } : {}),
      });

      resetForm();
      setAddGoalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save goal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1a1a1a] border-[3px] border-black brutalist-shadow p-6 relative">
        <button
          onClick={() => setAddGoalOpen(false)}
          className="absolute top-4 right-4 text-[#eeeeee] hover:text-[#cb2957] p-1 font-mono font-bold"
        >
          X
        </button>

        <h2 className="font-space text-2xl font-bold uppercase text-white mb-1 border-b-[3px] border-black pb-2">
          + ADD GOAL
        </h2>
        <p className="font-mono text-xs text-[#c6c6c6] mb-6">
          Create a target and track it from your savings goals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#93000a] border-[2px] border-black p-3 font-mono text-xs text-white">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Goal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency fund"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Target Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#ffb2bd] uppercase mb-1">Deadline Optional</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#131313] border-[3px] border-black p-3 font-mono text-sm text-white focus:outline-none focus:border-[#cb2957]"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-4 bg-[#cb2957] text-white font-space text-lg font-bold uppercase py-3 border-[3px] border-black brutalist-shadow hover:bg-[#ffb2bd] hover:text-black transition-colors"
          >
            {isSaving ? 'SYNCING...' : 'CONFIRM GOAL'}
          </button>
        </form>
      </div>
    </div>
  );
}
