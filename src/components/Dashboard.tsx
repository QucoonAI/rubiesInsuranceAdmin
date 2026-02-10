
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Users, Shield, Clock, RefreshCw } from 'lucide-react';
import { dashboardServiceApi } from '@/service/api/DashboardServiceApi';

const COVERAGE_COLORS = ['#0D0D12', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

const Dashboard: React.FC = () => {
  const { data, isLoading, isError, isFetching, refetch } = dashboardServiceApi.useGetDashboardQuery();

  const dashboardData = data?.data;
  const totalCoverage = dashboardData?.coverage?.totalCoverage ?? 0;

  const kpis = [
    { label: 'Active Plans', val: dashboardData?.activePlanCount?.toLocaleString() ?? '—', icon: Users, color: 'text-[#0D0D12]', bg: 'bg-[#0D0D12]/5' },
    { label: 'Total Coverage', val: totalCoverage ? `₦${totalCoverage.toLocaleString()}` : '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Claims', val: dashboardData?.claimCount?.toLocaleString() ?? '—', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Policies', val: dashboardData?.activePolicies?.toLocaleString() ?? '—', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const coverageChartData = useMemo(() => {
    const cov = dashboardData?.coverage;
    if (!cov) return [];
    return [
      { name: 'Shield', value: cov.shieldCoverage },
      { name: 'Travel', value: cov.travelCoverage },
      { name: 'Vehicle', value: cov.vehicleCoverage },
      { name: 'Credit Life', value: cov.creditLifeCoverage },
      { name: 'EduCare', value: cov.eduCareCoverage },
      { name: 'Tenant', value: cov.tenantCoverage },
    ];
  }, [dashboardData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#0D0D12] tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-1 font-medium">Global insurance performance and operational health.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Syncing...' : 'Sync'}
        </button>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load dashboard data</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`${kpi.bg} p-3 rounded-2xl`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{kpi.label}</h4>
            <p className={`text-3xl font-bold text-[#0D0D12] mt-2 tracking-tight ${isLoading ? 'animate-pulse bg-slate-100 rounded-lg w-24 h-9' : ''}`}>
              {isLoading ? '' : kpi.val}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#0D0D12] tracking-tight">Coverage Distribution</h3>
          <div className="flex items-center gap-4 flex-wrap">
            {coverageChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COVERAGE_COLORS[idx % COVERAGE_COLORS.length] }}></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0D0D12] rounded-full animate-spin"></div>
            </div>
          ) : coverageChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
              No coverage data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Coverage']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                  {coverageChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COVERAGE_COLORS[index % COVERAGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
