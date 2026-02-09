
import React, { useState, useMemo } from 'react';
import {
  FileSearch, MessageSquare, CheckCircle, XCircle, FileText,
  ArrowRight, ShieldAlert, Download, BrainCircuit
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { exportToCSV } from '../utils/csvExport';
import { claimServiceApi } from '@/service/api/ClaimServiceApi';
import { ApiClaim } from '@/types/api';

const Claims: React.FC = () => {
  const { data, isLoading, isError, refetch } = claimServiceApi.useGetClaimsQuery();
  const claims = data?.data ?? [];

  const [selectedClaim, setSelectedClaim] = useState<ApiClaim | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = { Reported: 0, Registered: 0, Outstanding: 0, Settled: 0, Rejected: 0 };
    claims.forEach(c => {
      const status = c.claimStatus || '';
      if (status in counts) counts[status]++;
    });
    return counts;
  }, [claims]);

  const runAiAnalysis = async (claim: ApiClaim) => {
    setAnalyzing(true);
    try {
      const description = `Claim #${claim.claimId} for subscription "${claim.claimSubscriptionName}" with amount $${claim.claimAmount}. Status: ${claim.claimStatus}.`;
      const result = await geminiService.analyzeClaim(description, []);
      setAiAnalysis(result || '');
    } catch (e) {
      setAiAnalysis('Analysis failed. Please review manually.');
    }
    setAnalyzing(false);
  };

  const handleOpenClaim = (claim: ApiClaim) => {
    setSelectedClaim(claim);
    setAiAnalysis('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Claims Adjudication</h2>
          <p className="text-slate-500 font-medium">End-to-end lifecycle tracking for global risk management.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(claims, 'rubies_insure_claims')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export Audit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
            <Download className="w-4 h-4" />
            Strategy Report
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load claims</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Reported', color: 'bg-[#0D0D12]' },
          { label: 'Registered', color: 'bg-[#0D0D12]/60' },
          { label: 'Outstanding', color: 'bg-amber-500' },
          { label: 'Settled', color: 'bg-emerald-500' },
          { label: 'Rejected', color: 'bg-rose-500' },
        ].map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group hover:shadow-lg transition-all">
            <div className={`w-8 h-1 rounded-full ${step.color} mb-4`} />
            <div className={`text-3xl font-black text-[#0D0D12] tracking-tighter ${isLoading ? 'animate-pulse bg-slate-100 rounded w-12 h-9' : ''}`}>
              {isLoading ? '' : pipelineCounts[step.label] ?? 0}
            </div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">{step.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Claim ID</th>
              <th className="px-6 py-4">Entity</th>
              <th className="px-6 py-4">Adjustment</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={6} className="px-6 py-5">
                    <div className="animate-pulse bg-slate-100 rounded-lg h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No claims found</td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim.claimId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs font-bold text-slate-400 group-hover:text-[#0D0D12]">CLM-{claim.claimId}</td>
                  <td className="px-6 py-5 font-bold text-[#0D0D12]">{claim.claimSubscriptionName || '—'}</td>
                  <td className="px-6 py-5 font-black text-[#0D0D12]">${(claim.claimAmount ?? 0).toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      claim.claimStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      claim.claimStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      claim.claimStatus === 'Registered' ? 'bg-[#0D0D12]/5 text-[#0D0D12] border-[#0D0D12]/10' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {claim.claimStatus || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{claim.claimCreatedAt || '—'}</td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleOpenClaim(claim)}
                      className="p-2 bg-slate-100 text-[#0D0D12] rounded-xl hover:bg-[#0D0D12] hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Claims Processing Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#0D0D12] rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter uppercase italic">CLM-{selectedClaim.claimId} — Portfolio Review</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjusting valuation: <span className="text-[#0D0D12]">${(selectedClaim.claimAmount ?? 0).toLocaleString()}.00</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Case Details</h4>
                  <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Subscription</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedClaim.claimSubscriptionName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Status</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedClaim.claimStatus || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Created</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedClaim.claimCreatedAt || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Updated</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedClaim.claimUpdatedAt || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Secure Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                    <FileSearch className="w-4 h-4" />
                    Internal Audit
                  </button>
                </div>
              </div>

              <div className="bg-[#0D0D12] rounded-[32px] p-8 border border-slate-800 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-white tracking-tight">AI Neural Assessment</h4>
                  </div>
                  <button
                    onClick={() => runAiAnalysis(selectedClaim)}
                    disabled={analyzing}
                    className="text-[10px] font-black text-white/50 uppercase tracking-[2px] hover:text-white disabled:opacity-30 transition-colors"
                  >
                    {analyzing ? 'Processing...' : 'Recalculate'}
                  </button>
                </div>

                <div className="flex-1 relative z-10">
                  {analyzing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
                      <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Analyzing fraud patterns...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-white/80 leading-relaxed font-medium">
                        {aiAnalysis}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-8 border border-white/10 rounded-[24px]">
                      <p className="text-white/40 text-sm italic font-medium">Initiate Neural Assessment for high-precision fraud detection and risk scoring.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex gap-4 relative z-10">
                  <button className="flex-1 py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all text-xs">
                    Reject Claim
                  </button>
                  <button className="flex-1 py-4 bg-white text-[#0D0D12] rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl text-xs">
                    Settle Account
                  </button>
                </div>
              </div>
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

export default Claims;
