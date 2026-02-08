
import React from 'react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { DollarSign, CheckCircle2, XCircle, Clock, RefreshCw, Download } from 'lucide-react';
import { Payment } from '../types';
import { exportToCSV } from '../utils/csvExport';

const mockPayments: Payment[] = [
  { id: 'TX-100', policyId: 'POL-88210', amount: 250, date: '2024-03-01', method: 'Visa', category: 'Life', status: 'Success' },
  { id: 'TX-101', policyId: 'POL-99122', amount: 180, date: '2024-03-01', method: 'MasterCard', category: 'Health', status: 'Success' },
  { id: 'TX-102', policyId: 'POL-44567', amount: 500, date: '2024-03-02', method: 'Bank Transfer', category: 'Savings', status: 'Pending' },
  { id: 'TX-103', policyId: 'POL-11223', amount: 120, date: '2024-03-02', method: 'Visa', category: 'Property', status: 'Success' },
  { id: 'TX-104', policyId: 'POL-88211', amount: 250, date: '2024-03-03', method: 'Apple Pay', category: 'Life', status: 'Failed' },
];

const categoryRev = [
  { category: 'Life', amount: 45000 },
  { category: 'Health', amount: 32000 },
  { category: 'Savings', amount: 15000 },
  { category: 'Property', amount: 12000 },
];

const COLORS = ['#0D0D12', '#10b981', '#f59e0b', '#ef4444'];

const Payments: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Global Ledger</h2>
          <p className="text-slate-500 font-medium">Reconcile cross-policy financial transactions in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(mockPayments, 'insureflow_payments')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm">
            <RefreshCw className="w-4 h-4" />
            Ledger Sync
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="font-bold text-[#0D0D12] tracking-tight">Recent Settlement Activity</h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Volume: $84,200.00</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Transaction UID</th>
                  <th className="px-6 py-4">Asset ID</th>
                  <th className="px-6 py-4">Classification</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-xs font-mono font-bold text-slate-400 group-hover:text-[#0D0D12]">{pay.id}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#0D0D12]">{pay.policyId}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        pay.category === 'Life' ? 'bg-[#0D0D12] text-white border-[#0D0D12]' :
                        pay.category === 'Health' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        pay.category === 'Savings' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {pay.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-[#0D0D12]">${pay.amount.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {pay.status === 'Success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {pay.status === 'Pending' && <Clock className="w-4 h-4 text-amber-500" />}
                        {pay.status === 'Failed' && <XCircle className="w-4 h-4 text-rose-500" />}
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{pay.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-[#0D0D12] mb-8 tracking-tight">Portfolio Revenue Mix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={categoryRev} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={32}>
                    {categoryRev.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-[#0D0D12] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="font-bold text-white/50 text-[10px] uppercase tracking-[3px]">Pending Settlement</span>
            </div>
            <div className="text-4xl font-black mb-2 tracking-tighter italic">$4,250.00</div>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">
              12 transactions currently awaiting <span className="text-white italic">inter-bank verification</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
