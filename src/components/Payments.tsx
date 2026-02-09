
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DollarSign, CheckCircle2, RefreshCw, Download, Plus, X, Building2, Info } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { paymentServiceApi } from '@/service/api/PaymentServiceApi';
import { toast } from 'sonner';

const categoryRev = [
  { category: 'Life', amount: 45000 },
  { category: 'Health', amount: 32000 },
  { category: 'Savings', amount: 15000 },
  { category: 'Property', amount: 12000 },
];

const mockPolicyPayments = [
  { policy: 'Shield Comprehensive', count: 24, total: 45000, type: 'Life' },
  { policy: 'Health Plus', count: 18, total: 32000, type: 'Health' },
  { policy: 'EduCare Savings', count: 12, total: 15000, type: 'Savings' },
  { policy: 'Tenant Cover', count: 8, total: 12000, type: 'Property' },
  { policy: 'Travel Guard', count: 6, total: 8500, type: 'Travel' },
  { policy: 'Credit Life', count: 4, total: 6200, type: 'Life' },
];

const COLORS = ['#0D0D12', '#10b981', '#f59e0b', '#ef4444'];

const Payments: React.FC = () => {
  const { data, isLoading, isError, isFetching, refetch } = paymentServiceApi.useGetPaymentAccountsQuery();
  const accounts = data?.data ?? [];

  // View toggle
  const [view, setView] = useState<'accounts' | 'policy'>('accounts');

  // Add account modal
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ accountName: '', accountNumber: '', bankCode: '', isPrimary: false });

  const handleAddAccount = () => {
    if (!newAccount.accountName || !newAccount.accountNumber || !newAccount.bankCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Account ${newAccount.accountName} added successfully`);
    setShowAddAccount(false);
    setNewAccount({ accountName: '', accountNumber: '', bankCode: '', isPrimary: false });
  };

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
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Account
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

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('accounts')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            view === 'accounts' ? 'bg-[#0D0D12] text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Payment Accounts
        </button>
        <button
          onClick={() => setView('policy')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            view === 'policy' ? 'bg-[#0D0D12] text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          By Policy
        </button>
      </div>

      {view === 'accounts' ? (
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
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-[#0D0D12] tracking-tight">Portfolio Revenue Mix</h3>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase tracking-widest">Sample Data</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={categoryRev} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={32}>
                      {categoryRev.map((_entry, index) => (
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
      ) : (
        /* Policy Breakdown View */
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-[#0D0D12] tracking-tight">Payments by Policy</h3>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" />
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Sample Data</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Policy</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Transactions</th>
                  <th className="px-6 py-4">Total Revenue</th>
                  <th className="px-6 py-4 text-right">Avg. Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPolicyPayments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-[#0D0D12]">{p.policy}</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{p.count}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#0D0D12]">${p.total.toLocaleString()}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500 text-right">${Math.round(p.total / p.count).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-100">
                <tr>
                  <td className="px-6 py-4 font-black text-[#0D0D12]">Total</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 font-black text-[#0D0D12]">{mockPolicyPayments.reduce((s, p) => s + p.count, 0)}</td>
                  <td className="px-6 py-4 font-black text-[#0D0D12]">${mockPolicyPayments.reduce((s, p) => s + p.total, 0).toLocaleString()}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            onClick={() => {
              exportToCSV(mockPolicyPayments, 'rubies_policy_payments');
              toast.success('Policy payment report exported');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export Policy Report
          </button>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Add Payment Account</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Register a new bank account</p>
              </div>
              <button onClick={() => setShowAddAccount(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bank *</label>
                <select
                  value={newAccount.bankCode}
                  onChange={e => setNewAccount(prev => ({ ...prev, bankCode: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                >
                  <option value="">Select Bank</option>
                  <option value="044">Access Bank</option>
                  <option value="058">GTBank</option>
                  <option value="011">First Bank</option>
                  <option value="033">UBA</option>
                  <option value="057">Zenith Bank</option>
                  <option value="215">Unity Bank</option>
                  <option value="221">Stanbic IBTC</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Account Number *</label>
                <input
                  type="text"
                  value={newAccount.accountNumber}
                  onChange={e => setNewAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                  maxLength={10}
                  placeholder="10-digit account number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Account Name *</label>
                <input
                  type="text"
                  value={newAccount.accountName}
                  onChange={e => setNewAccount(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Account holder name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={newAccount.isPrimary}
                  onChange={e => setNewAccount(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-[#0D0D12] focus:ring-[#0D0D12]"
                />
                <label className="text-sm font-bold text-slate-700">Set as primary account</label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddAccount(false)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
