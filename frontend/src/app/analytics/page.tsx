'use client';

import { useAppStore } from '@/store/useAppStore';
import AvatarIcon from '@/components/ui/AvatarIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsPage() {
  const { level, selectedCharacter, isSidebarCollapsed, analyticsDonutData, analyticsBarData, tacticalInsights, apiStatus } = useAppStore();
  const hasDonutData = analyticsDonutData.length > 0;
  const hasBarData = analyticsBarData.length > 0;
  const centerValue = hasDonutData ? `${analyticsDonutData[0].value}%` : '--';

  return (
    <main className={`pt-20 lg:pt-8 pb-24 lg:pb-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
    }`}>
      {/* Header */}
      <header className="mb-8 border-b-[3px] border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-space text-3xl sm:text-5xl font-bold text-white uppercase tracking-tighter mb-1">
            DATA VISUALIZER
          </h1>
          <p className="font-mono text-xs text-[#c6c6c6]">System Status: Optimal | Data Stream: Active</p>
        </div>

        {/* Avatar + Level Badge */}
        <div className="flex items-center gap-3 bg-[#1a1a1a] border-[3px] border-black px-3 py-1.5 brutalist-shadow">
          <AvatarIcon character={selectedCharacter} size="sm" />
          <span className="font-mono text-xs font-bold text-[#ffb2bd]">
            LVL {level}
          </span>
        </div>
      </header>

      {/* Bento Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Resource Allocation Donut */}
        <section className="lg:col-span-5 bg-[#1a1a1a] border-[3px] border-black p-6 brutalist-shadow flex flex-col h-[420px]">
          <h2 className="font-mono text-xs font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-4">
            Resource Allocation
          </h2>

          <div className="flex-1 w-full bg-[#131313] border-[2px] border-black p-4 relative flex items-center justify-center">
            {hasDonutData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={3}
                  >
                    {analyticsDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="font-mono text-xs font-bold uppercase text-[#c6c6c6]">No data available</span>
            )}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-space text-3xl font-bold text-white">{centerValue}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {analyticsDonutData.map((d) => (
              <span
                key={d.name}
                style={{ backgroundColor: d.color }}
                className="font-mono text-[10px] font-bold border-[2px] border-black px-2 py-1 text-black"
              >
                {d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </section>

        {/* Inflow vs Outflow Bar Chart */}
        <section className="lg:col-span-7 bg-[#1a1a1a] border-[3px] border-black p-6 brutalist-shadow flex flex-col h-[420px]">
          <h2 className="font-mono text-xs font-bold text-white uppercase border-b-[3px] border-black pb-2 mb-4">
            Inflow vs Outflow (Monthly)
          </h2>

          <div className="flex-1 w-full bg-[#131313] border-[2px] border-black p-4 flex items-center justify-center">
            {hasBarData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsBarData}>
                  <XAxis dataKey="quarter" stroke="#c6c6c6" tick={{ fill: '#c6c6c6', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#c6c6c6" tick={{ fill: '#c6c6c6', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131313', border: '2px solid #000', color: '#fff', fontFamily: 'JetBrains Mono' }}
                  />
                  <Bar dataKey="Inflow" fill="#77da9f" stroke="#000" strokeWidth={2} />
                  <Bar dataKey="Outflow" fill="#cb2957" stroke="#000" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="font-mono text-xs font-bold uppercase text-[#c6c6c6]">No data available</span>
            )}
          </div>
        </section>
      </div>

      {/* Tactical Summary Banner */}
      <section className="bg-[#cb2957] border-[3px] border-black p-6 brutalist-shadow text-black">
        <div className="flex items-center gap-3 border-b-[3px] border-black pb-3 mb-4">
          <span className="material-symbols-outlined text-3xl font-bold">warning</span>
          <h2 className="font-space text-2xl font-bold uppercase">Tactical Summary</h2>
        </div>

        <ul className="space-y-3 font-mono text-xs font-bold">
          {(tacticalInsights.length ? tacticalInsights : [apiStatus === 'loading' ? 'Loading analytics from your finance data.' : 'No analytics data available yet.']).map((insight) => (
            <li key={insight} className="flex items-start gap-2">
              <span>&bull;</span>
              <div>{insight}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
