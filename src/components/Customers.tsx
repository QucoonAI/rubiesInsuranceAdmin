
import React, { useState } from 'react';
import { Search, Download, UserPlus, ChevronRight, RefreshCw } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { customerServiceApi } from '@/service/api/CustomerServiceApi';

const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, isFetching, refetch } = customerServiceApi.useGetCustomersQuery({
    page: page.toString(),
    size: pageSize.toString(),
    ...(searchQuery ? { search: searchQuery } : {}),
  });
  const customers = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Customer Intelligence</h2>
          <p className="text-slate-500 font-medium">Manage and audit client portfolios for global compliance.</p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D0D12] w-64 text-slate-800"
            />
          </form>
          <button
            onClick={() => exportToCSV(customers, 'rubies_insure_customers')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-300 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load customers</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Customer Entity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Phone</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Joined</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Status</th>
              <th className="px-6 py-4 text-right"></th>
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
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No customers found</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.userId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#0D0D12] font-black shadow-sm group-hover:bg-[#0D0D12] group-hover:text-white transition-all duration-300">
                        {(customer.userFirstName ?? '?').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0D0D12]">{customer.userFirstName} {customer.userLastName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{customer.userEmail ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{customer.userNumber ?? '—'}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{customer.userCreatedAt ?? '—'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      customer.userStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      customer.userStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {customer.userStatus ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-[#0D0D12] hover:bg-slate-100 rounded-xl transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {totalSize} total customers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-[#0D0D12]">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={customers.length < pageSize}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
