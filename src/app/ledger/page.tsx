'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';

export default function LedgerPage() {
  const { level, selectedCharacter, transactions, isSidebarCollapsed } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch = tx.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-[3px] border-black pb-6">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-1">
            LEDGER ARCHIVE
          </h1>
          <p className="font-mono text-xs text-[#c6c6c6]">HISTORICAL TRANSACTION AUDIT LOGS</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Avatar + Level Badge */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] border-[3px] border-black px-3 py-1.5 brutalist-shadow">
            <AvatarIcon character={selectedCharacter} size="sm" />
            <span className="font-mono text-xs font-bold text-[#ffb2bd]">
              LVL {level}
            </span>
          </div>

          <button className="bg-[#cb2957] text-black border-[3px] border-black px-4 py-2 font-mono text-xs font-bold uppercase brutalist-shadow flex items-center gap-2 hover:bg-[#ffb2bd] transition-colors">
            <span className="material-symbols-outlined text-sm font-bold">download</span>
            QUICK EXPORT
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-[#1a1a1a] border-[3px] border-black p-4 brutalist-shadow mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="QUERY LEDGER..."
            className="w-full bg-[#131313] border-[2px] border-black p-3 font-mono text-xs text-white focus:outline-none focus:border-[#cb2957]"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'debit' | 'credit')}
            className="bg-[#131313] border-[2px] border-black p-3 font-mono text-xs text-white focus:outline-none focus:border-[#cb2957]"
          >
            <option value="all">ALL TYPES</option>
            <option value="debit">DEBIT (-)</option>
            <option value="credit">CREDIT (+)</option>
          </select>

          <select className="bg-[#131313] border-[2px] border-black p-3 font-mono text-xs text-white focus:outline-none focus:border-[#cb2957]">
            <option>LAST 30 DAYS</option>
            <option>LAST 7 DAYS</option>
            <option>ANY DATE</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <section className="bg-[#131313] border-[3px] border-black p-0 brutalist-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-[3px] border-black bg-[#1a1a1a]">
                <th className="p-4 font-mono text-xs uppercase text-[#c6c6c6] font-bold">Icon</th>
                <th className="p-4 font-mono text-xs uppercase text-[#c6c6c6] font-bold">Entity</th>
                <th className="p-4 font-mono text-xs uppercase text-[#c6c6c6] font-bold">Class / Category</th>
                <th className="p-4 font-mono text-xs uppercase text-[#c6c6c6] font-bold">Timestamp</th>
                <th className="p-4 font-mono text-xs uppercase text-[#c6c6c6] font-bold text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map((tx) => (
                <tr key={tx.id} className="border-b-[2px] border-black/50 hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className={`w-9 h-9 border-[2px] border-black flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-[#77da9f]/20 text-[#77da9f]' : 'bg-[#cb2957]/20 text-[#cb2957]'
                    }`}>
                      <span className="material-symbols-outlined text-base">{tx.icon}</span>
                    </div>
                  </td>
                  <td className="p-4 font-space font-bold text-white text-base">{tx.entity}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs uppercase border-[2px] border-black px-2.5 py-1 bg-[#2a2a2a] text-white">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 text-[#c6c6c6] font-mono text-xs">{tx.date}</td>
                  <td className={`p-4 text-right font-mono font-bold text-base ${
                    tx.type === 'credit' ? 'text-[#77da9f]' : 'text-[#ffb4ab]'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#1a1a1a] border-t-[3px] border-black text-center">
          <button className="w-full bg-[#2a2a2a] text-white border-[2px] border-black py-3 font-mono text-xs font-bold uppercase hover:bg-[#cb2957] hover:text-black transition-colors brutalist-shadow">
            LOAD PREVIOUS CYCLES...
          </button>
        </div>
      </section>
    </main>
  );
}
