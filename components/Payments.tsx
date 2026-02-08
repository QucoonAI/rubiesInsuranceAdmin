
import React from 'react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { DollarSign, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Payment } from '../types';

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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Reconciliation</h2>
          <p className="text-slate-500">Differentiate payments across various policy types and monitor performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all">
          <RefreshCw className="w-4 h-4" />
          Reconcile Ledger
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Transaction History</h3>
            <div className="text-xs text-slate-400">Total volume: $84,200.00</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Policy ID</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">{pay.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{pay.policyId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        pay.category === 'Life' ? 'bg-blue-50 text-blue-600' :
                        pay.category === 'Health' ? 'bg-emerald-50 text-emerald-600' :
                        pay.category === 'Savings' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {pay.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">${pay.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {pay.status === 'Success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {pay.status === 'Pending' && <Clock className="w-4 h-4 text-amber-500" />}
                        {pay.status === 'Failed' && <XCircle className="w-4 h-4 text-rose-500" />}
                        <span className="text-sm font-medium text-slate-600">{pay.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Revenue Mix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={categoryRev} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {categoryRev.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white/80">Pending Settlement</span>
            </div>
            <div className="text-3xl font-bold mb-1">$4,250.00</div>
            <p className="text-blue-100 text-sm">Awaiting bank verification (12 txns)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
