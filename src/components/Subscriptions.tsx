
import React, { useState } from 'react';
import { Download, Eye, FileCheck, Search, Filter, PieChart } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { subscriptionServiceApi } from '@/service/api/SubscriptionServiceApi';
import { ApiSubscription } from '@/types/api';

const Subscriptions: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError, refetch } = subscriptionServiceApi.useGetSubscriptionsQuery({
    page: page.toString(),
    size: pageSize.toString(),
  });
  const subscriptions = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const [viewingCert, setViewingCert] = useState<ApiSubscription | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Active Underwriting</h2>
          <p className="text-slate-500 font-medium">Verify policy distributions and generate risk reports.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(subscriptions, 'rubies_insure_subscriptions')}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Audit Log
          </button>
          <button className="px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Performance
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load subscriptions</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Vault</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="animate-pulse bg-slate-100 rounded-lg h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No subscriptions found</td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.subscriptionId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#0D0D12]">SUB-{sub.subscriptionId}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{sub.subscriptionPolicyName || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      sub.subscriptionStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      sub.subscriptionStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {sub.subscriptionStatus || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-[#0D0D12]">${sub.subscriptionPaymentAmount ?? 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setViewingCert(sub)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-[#0D0D12] hover:text-white rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {totalSize} total subscriptions
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
              disabled={subscriptions.length < pageSize}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {viewingCert && (
        <div className="fixed inset-0 bg-[#0D0D12]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0D0D12] rounded-2xl">
                  <FileCheck className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Policy Archive</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px]">SUB-{viewingCert.subscriptionId}</p>
                </div>
              </div>
              <button onClick={() => setViewingCert(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-12 space-y-8 bg-white border-[12px] border-slate-50 m-6 rounded-[32px] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 scale-[5] -z-10 opacity-30">
                <img src="/logo.svg" alt="" className="w-32 h-32" />
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-[#0D0D12] mb-1 tracking-tighter italic">CERTIFICATE</h1>
                <p className="text-slate-400 uppercase tracking-[5px] text-[10px] font-bold">Official Coverage Record</p>
              </div>

              <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Policy Name</label>
                  <p className="text-xl font-black text-[#0D0D12] tracking-tight">{viewingCert.subscriptionPolicyName || '—'}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Status</label>
                  <p className="text-xl font-black text-[#0D0D12] tracking-tight">{viewingCert.subscriptionStatus || '—'}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Effective Term</label>
                  <p className="font-bold text-slate-600">{viewingCert.subscriptionStartDate || '—'} — {viewingCert.subscriptionEndDate || '—'}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Payment Amount</label>
                  <p className="text-[#0D0D12] font-black text-lg">${viewingCert.subscriptionPaymentAmount ?? 0}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Assured Sum</label>
                  <p className="font-bold text-slate-600">${(viewingCert.subscriptionAssuredSum ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Frequency</label>
                  <p className="font-bold text-slate-600">{viewingCert.subscriptionContributionFrequency || '—'}</p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                  Issued by Rubies Insure Corporate Security. This electronic record is cryptographically signed and legally binding.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-sm">
                Distribute via Email
              </button>
              <button className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black flex items-center gap-2 shadow-xl shadow-slate-200 transition-all text-sm">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const MoreHorizontal: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Subscriptions;
