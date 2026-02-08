
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
          <p className="text-slate-500">Real-time performance metrics and strategic analysis.</p>
        </div>
        <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-100">
          Last updated: Today, 10:45 AM
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Customers', val: '1,240', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Monthly Revenue', val: '$67,400', change: '+8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Claims Rate', val: '28%', change: '-2%', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Process Time', val: '3.4 Days', change: '-15%', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${kpi.bg} p-3 rounded-xl`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'} flex items-center`}>
                {kpi.change} <ArrowUpRight className="w-4 h-4 ml-0.5" />
              </span>
            </div>
            <h4 className="text-slate-500 text-sm font-medium">{kpi.label}</h4>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue vs Claims Volume</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPerformanceData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="claims" stroke="#ef4444" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
