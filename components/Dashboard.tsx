
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ArrowUpRight, TrendingUp, Users, Shield, Clock } from 'lucide-react';

const mockPerformanceData = [
  { name: 'Jan', revenue: 45000, claims: 12000 },
  { name: 'Feb', revenue: 52000, claims: 15000 },
  { name: 'Mar', revenue: 48000, claims: 11000 },
  { name: 'Apr', revenue: 61000, claims: 18000 },
  { name: 'May', revenue: 55000, claims: 14000 },
  { name: 'Jun', revenue: 67000, claims: 16000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#0D0D12] tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-1 font-medium">Global insurance performance and operational health.</p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-4 py-2 rounded-xl border border-slate-200">
          Sync: 2m ago
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Customers', val: '1,240', change: '+12%', icon: Users, color: 'text-[#0D0D12]', bg: 'bg-[#0D0D12]/5' },
          { label: 'Monthly Revenue', val: '$67,400', change: '+8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Claims Rate', val: '28%', change: '-2%', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Process Time', val: '3.4 Days', change: '-15%', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`${kpi.bg} p-3 rounded-2xl`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${kpi.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} flex items-center`}>
                {kpi.change} <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{kpi.label}</h4>
            <p className="text-3xl font-bold text-[#0D0D12] mt-2 tracking-tight">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#0D0D12] tracking-tight">Performance Velocity</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0D0D12]"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claims</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPerformanceData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D0D12" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0D0D12" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
              <Tooltip 
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#0D0D12" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="claims" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
