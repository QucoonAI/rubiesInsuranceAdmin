import React, { useMemo, useState } from 'react';
import { Download, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { policyDocumentServiceApi } from '@/service/api/PolicyDocumentServiceApi';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const PolicyDocuments: React.FC = () => {
  const { data, isLoading, isError, isFetching, refetch } = policyDocumentServiceApi.useGetPolicyDocumentsQuery();
  const documents = data?.data ?? [];

  const [getDocumentUrl, { isFetching: isOpening }] = policyDocumentServiceApi.useLazyGetPolicyDocumentUrlQuery();
  const [openingId, setOpeningId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return documents.slice(start, start + PAGE_SIZE);
  }, [documents, page]);
  const totalPages = Math.max(1, Math.ceil(documents.length / PAGE_SIZE));

  const handleOpen = async (policyDocumentId: number) => {
    setOpeningId(policyDocumentId);
    try {
      const res = await getDocumentUrl(policyDocumentId).unwrap();
      if (res.data) {
        window.open(res.data, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('No document URL returned');
      }
    } catch {
      toast.error('Failed to load document');
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Policy Documents</h2>
          <p className="text-slate-500 font-medium">Inspect and retrieve issued policy documents.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(documents, 'rubies_insure_policy_documents')}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 border border-slate-200 bg-white text-slate-400 rounded-xl hover:bg-slate-50 hover:text-[#0D0D12] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load policy documents</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscription</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Vault</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={7} className="px-6 py-4">
                    <div className="animate-pulse bg-slate-100 rounded-lg h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No policy documents found</td>
              </tr>
            ) : (
              paged.map((doc) => (
                <tr key={doc.policyDocumentId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#0D0D12]">PD-{doc.policyDocumentId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{doc.policyDocumentSubscriptionId ?? '—'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{doc.policyDocumentPolicyId ?? '—'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{doc.policyDocumentUserId ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      doc.policyDocumentStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      doc.policyDocumentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {doc.policyDocumentStatus || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{doc.policyDocumentCreatedAt || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpen(doc.policyDocumentId)}
                      disabled={openingId === doc.policyDocumentId && isOpening}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-[#0D0D12] hover:text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      {openingId === doc.policyDocumentId && isOpening ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
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
            {documents.length} total documents
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-[#0D0D12]">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
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

export default PolicyDocuments;
