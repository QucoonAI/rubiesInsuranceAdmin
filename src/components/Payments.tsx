
import React from 'react';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DollarSign, CheckCircle2, XCircle, Clock, RefreshCw, Download } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { paymentServiceApi } from '@/service/api/PaymentServiceApi';

const categoryRev = [
  { category: 'Life', amount: 45000 },
  { category: 'Health', amount: 32000 },
  { category: 'Savings', amount: 15000 },
  { category: 'Property', amount: 12000 },
];

const COLORS = ['#0D0D12', '#10b981', '#f59e0b', '#ef4444'];

const Payments: React.FC = () => {
  const { data, isLoading, isError, isFetching, refetch } = paymentServiceApi.useGetPaymentAccountsQuery();
  const accounts = data?.data ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Global Ledger</h2>
          <p className="text-slate-500 font-medium">Reconcile cross-policy financial transactions in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(accounts, 'rubies_insure_payments')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Ledger Sync
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load payment accounts</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="font-bold text-[#0D0D12] tracking-tight">Payment Accounts</h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{accounts.length} Account(s)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Account ID</th>
                  <th className="px-6 py-4">Account Name</th>
                  <th className="px-6 py-4">Account Number</th>
                  <th className="px-6 py-4">Primary</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={5} className="px-6 py-5">
                        <div className="animate-pulse bg-slate-100 rounded-lg h-5 w-full" />
                      </td>
                    </tr>
                  ))
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No payment accounts found</td>
                  </tr>
                ) : (
                  accounts.map((acct) => (
                    <tr key={acct.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 text-xs font-mono font-bold text-slate-400 group-hover:text-[#0D0D12]">PA-{acct.id}</td>
                      <td className="px-6 py-5 text-sm font-black text-[#0D0D12]">{acct.accountName || '—'}</td>
                      <td className="px-6 py-5 text-sm font-mono font-bold text-slate-600">{acct.accountNumber}</td>
                      <td className="px-6 py-5">
                        {acct.isPrimary ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          acct.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          acct.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {acct.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
              <span className="font-bold text-white/50 text-[10px] uppercase tracking-[3px]">Total Accounts</span>
            </div>
            <div className="text-4xl font-black mb-2 tracking-tighter italic">{accounts.length}</div>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">
              {accounts.filter(a => a.isPrimary).length} primary account(s) <span className="text-white italic">configured</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
