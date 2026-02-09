
import React from 'react';
import { Search, Filter, Download, UserPlus, FileText, ChevronRight } from 'lucide-react';
import { Customer } from '../types';
import { exportToCSV } from '../utils/csvExport';

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', policyType: 'Life Insurance', renewalDate: '2024-12-15', status: 'Active', maturityDate: '2035-06-12' },
  { id: '2', name: 'Alice Smith', email: 'alice@company.com', phone: '+1 345 678 901', policyType: 'Health Premium', renewalDate: '2024-05-10', status: 'Pending', maturityDate: '2029-01-01' },
  { id: '3', name: 'Bob Johnson', email: 'bob.j@web.net', phone: '+1 456 789 012', policyType: 'Savings Plan', renewalDate: '2025-01-20', status: 'Active', maturityDate: '2030-01-20' },
  { id: '4', name: 'Emma Wilson', email: 'emma@domain.io', phone: '+1 567 890 123', policyType: 'Property Protect', renewalDate: '2024-03-12', status: 'Inactive', maturityDate: '2024-03-12' },
];

const Customers: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Customer Intelligence</h2>
          <p className="text-slate-500 font-medium">Manage and audit client portfolios for global compliance.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D0D12] w-64 text-slate-800"
            />
          </div>
          <button 
            onClick={() => exportToCSV(mockCustomers, 'rubies_insure_customers')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-300 transition-all text-sm">
            <UserPlus className="w-4 h-4" />
            New Client
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Customer Entity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Core Policy</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Renewal</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#0D0D12] font-black shadow-sm group-hover:bg-[#0D0D12] group-hover:text-white transition-all duration-300">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#0D0D12]">{customer.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <FileText className="w-4 h-4 text-slate-300" />
                    {customer.policyType}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-500">{customer.renewalDate}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                    customer.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-slate-300 hover:text-[#0D0D12] hover:bg-slate-100 rounded-xl transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
