
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Sparkles, ArrowUpRight, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const mockPerformanceData = [
  { name: 'Jan', revenue: 45000, claims: 12000 },
  { name: 'Feb', revenue: 52000, claims: 15000 },
  { name: 'Mar', revenue: 48000, claims: 11000 },
  { name: 'Apr', revenue: 61000, claims: 18000 },
  { name: 'May', revenue: 55000, claims: 14000 },
  { name: 'Jun', revenue: 67000, claims: 16000 },
];

const categoryData = [
  { name: 'Life', value: 400 },
  { name: 'Health', value: 300 },
  { name: 'Savings', value: 300 },
  { name: 'Property', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const result = await geminiService.getStrategicInsights({
        totalRevenue: 328000,
        activeCustomers: 1240,
        claimsRatio: 0.28,
        retentionRate: 0.94
      });
      setInsights(result || 'No insights available.');
    } catch (e) {
      setInsights('Failed to load AI insights.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue vs Claims Volume</h3>
          <div className="h-80 w-full">
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

        {/* AI Insight Section */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg tracking-wide uppercase text-blue-400">Strategic Intelligence</h3>
            </div>
            {loading ? (
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 animate-pulse">Analyzing portal data...</p>
              </div>
            ) : (
              <div className="flex-1">
                <div className="prose prose-invert prose-sm">
                  <p className="leading-relaxed text-slate-300">
                    {insights || 'Generate strategic analysis based on current portal metrics.'}
                  </p>
                </div>
              </div>
            )}
            <button 
              onClick={fetchInsights}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Recalculate Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
