
import React, { useState, useMemo } from 'react';
import {
  FileSearch, FileText,
  ArrowRight, ShieldAlert, Download, BrainCircuit,
  FileImage, Calendar, X, Eye, ChevronLeft, Loader2, RefreshCw
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { exportToCSV } from '../utils/csvExport';
import { claimServiceApi } from '@/service/api/ClaimServiceApi';
import { paymentServiceApi } from '@/service/api/PaymentServiceApi';
import { ApiClaim } from '@/types/api';
import { toast } from 'sonner';

const Claims: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError, isFetching, refetch } = claimServiceApi.useGetClaimsQuery({
    page: page.toString(),
    size: pageSize.toString(),
  });
  const claims = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const [toggleClaimStatus, { isLoading: isToggling }] = claimServiceApi.useToggleClaimStatusMutation();

  const [selectedClaim, setSelectedClaim] = useState<ApiClaim | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  // Document queries
  const { data: docsData, isLoading: docsLoading } = claimServiceApi.useGetClaimDocumentsQuery(
    selectedClaim?.claimId ?? 0,
    { skip: !selectedClaim }
  );
  const claimDocuments = docsData?.data ?? [];
  const [getDocUrl] = claimServiceApi.useLazyGetClaimDocumentUrlQuery();

  // Banks for settle form
  const { data: banksData } = paymentServiceApi.useGetBanksQuery();
  const banks = banksData?.data ?? [];

  // Modal view states
  const [claimAction, setClaimAction] = useState<'reject' | 'settle' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [settleAccountName, setSettleAccountName] = useState('');
  const [settleAccountNumber, setSettleAccountNumber] = useState('');
  const [settleBankCode, setSettleBankCode] = useState('');

  // Report modal
  const [showReport, setShowReport] = useState(false);
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [reportStatus, setReportStatus] = useState('all');

  const pipelineCounts = useMemo(() => ({
    Pending: data?.pendingCount ?? 0,
    Approved: data?.approvedCount ?? 0,
    Settled: data?.settledCount ?? 0,
    Rejected: data?.rejectedCount ?? 0,
  }), [data]);

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (reportStatus !== 'all' && c.claimStatus !== reportStatus) return false;
      if (reportDateFrom && c.claimCreatedAt && c.claimCreatedAt < reportDateFrom) return false;
      if (reportDateTo && c.claimCreatedAt && c.claimCreatedAt > reportDateTo) return false;
      return true;
    });
  }, [claims, reportStatus, reportDateFrom, reportDateTo]);

  const reportSummary = useMemo(() => {
    const summary: Record<string, number> = { Reported: 0, Registered: 0, Outstanding: 0, Settled: 0, Rejected: 0 };
    filteredClaims.forEach(c => {
      const s = c.claimStatus || '';
      if (s in summary) summary[s]++;
    });
    const totalAmount = filteredClaims.reduce((sum, c) => sum + (c.claimAmount ?? 0), 0);
    return { ...summary, total: filteredClaims.length, totalAmount };
  }, [filteredClaims]);

  const runAiAnalysis = async (claim: ApiClaim) => {
    setAnalyzing(true);
    try {
      const description = `Claim #${claim.claimId} for subscription "${claim.claimSubscriptionName}" with amount ₦${claim.claimAmount}. Status: ${claim.claimStatus}.`;
      const result = await geminiService.analyzeClaim(description, []);
      setAiAnalysis(result || '');
    } catch {
      setAiAnalysis('Analysis failed. Please review manually.');
    }
    setAnalyzing(false);
  };

  const handleOpenClaim = (claim: ApiClaim) => {
    setSelectedClaim(claim);
    setAiAnalysis('');
    setClaimAction(null);
  };

  const handleAcceptClaim = async () => {
    if (!selectedClaim?.claimId) return;
    try {
      await toggleClaimStatus({ claimId: selectedClaim.claimId, action: 'APPROVED' }).unwrap();
      toast.success(`Claim CLM-${selectedClaim.claimId} has been accepted`);
      setSelectedClaim(null);
    } catch {
      toast.error('Failed to accept claim');
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedClaim?.claimId) return;
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await toggleClaimStatus({ claimId: selectedClaim.claimId, action: 'REJECTED' }).unwrap();
      toast.success(`Claim CLM-${selectedClaim.claimId} has been rejected`);
      setClaimAction(null);
      setRejectReason('');
      setSelectedClaim(null);
    } catch {
      toast.error('Failed to reject claim');
    }
  };

  const handleConfirmSettle = async () => {
    if (!selectedClaim?.claimId) return;
    if (!settleAccountName.trim() || !settleAccountNumber.trim() || !settleBankCode) {
      toast.error('Please fill in all bank details');
      return;
    }
    const selectedBank = banks.find(b => b.bankCode === settleBankCode);
    try {
      await toggleClaimStatus({
        claimId: selectedClaim.claimId,
        action: 'SETTLED',
        recipientAccountName: settleAccountName,
        recipientAccountNumber: settleAccountNumber,
        recipientBankCode: settleBankCode,
        recipientBankName: selectedBank?.bankName || '',
      }).unwrap();
      toast.success(`Claim CLM-${selectedClaim.claimId} settlement initiated`);
      setClaimAction(null);
      setSettleAccountName('');
      setSettleAccountNumber('');
      setSettleBankCode('');
      setSelectedClaim(null);
    } catch {
      toast.error('Failed to settle claim');
    }
  };

  const handleViewDocument = async (claimId: number, documentId: number) => {
    try {
      const result = await getDocUrl({ claimId, documentId }).unwrap();
      if (result.data) {
        window.open(result.data, '_blank');
      }
    } catch {
      toast.error('Failed to load document');
    }
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
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm"
          >
            <Calendar className="w-4 h-4" />
            Strategy Report
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
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load claims</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending', color: 'bg-[#0D0D12]' },
          { label: 'Approved', color: 'bg-blue-500' },
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

      {/* Claims Table */}
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
                  <td className="px-6 py-5 font-black text-[#0D0D12]">₦{(claim.claimAmount ?? 0).toLocaleString()}</td>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {totalSize} total claims
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
              disabled={claims.length < pageSize}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Claims Strategy Report</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter and export claims data</p>
              </div>
              <button onClick={() => setShowReport(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">From Date</label>
                  <input
                    type="date"
                    value={reportDateFrom}
                    onChange={e => setReportDateFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">To Date</label>
                  <input
                    type="date"
                    value={reportDateTo}
                    onChange={e => setReportDateTo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                  <select
                    value={reportStatus}
                    onChange={e => setReportStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Reported">Reported</option>
                    <option value="Registered">Registered</option>
                    <option value="Outstanding">Outstanding</option>
                    <option value="Settled">Settled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-black text-[#0D0D12]">{reportSummary.total}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Claims</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-black text-[#0D0D12]">₦{reportSummary.totalAmount.toLocaleString()}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Value</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-700">{reportSummary.Settled}</div>
                  <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Settled</div>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <div className="text-2xl font-black text-rose-700">{reportSummary.Rejected}</div>
                  <div className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Rejected</div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Claim ID</th>
                      <th className="px-4 py-3">Entity</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm font-medium">No claims match the selected filters</td>
                      </tr>
                    ) : (
                      filteredClaims.slice(0, 20).map((claim) => (
                        <tr key={claim.claimId} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500">CLM-{claim.claimId}</td>
                          <td className="px-4 py-3 text-sm font-bold text-[#0D0D12]">{claim.claimSubscriptionName || '—'}</td>
                          <td className="px-4 py-3 text-sm font-black text-[#0D0D12]">₦{(claim.claimAmount ?? 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                              claim.claimStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700' :
                              claim.claimStatus === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>{claim.claimStatus || '—'}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{claim.claimCreatedAt || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowReport(false)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  exportToCSV(filteredClaims, 'rubies_claims_report');
                  toast.success('Report exported successfully');
                }}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjusting valuation: <span className="text-[#0D0D12]">₦{(selectedClaim.claimAmount ?? 0).toLocaleString()}.00</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                <>
                    {/* Case Details */}
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

                    {/* Supporting Documents */}
                    <div>
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Supporting Documents</h4>
                      <div className="space-y-2">
                        {docsLoading ? (
                          <div className="flex items-center justify-center p-6">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                          </div>
                        ) : claimDocuments.length === 0 ? (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-sm text-slate-400 font-medium">No documents uploaded</p>
                          </div>
                        ) : (
                          claimDocuments.map(doc => {
                            const fileName = doc.documentS3Key.split('/').pop() || doc.documentS3Key;
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                            return (
                              <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
                                <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:bg-[#0D0D12] group-hover:border-[#0D0D12] transition-colors">
                                  {isImage ? (
                                    <FileImage className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-[#0D0D12] truncate">{fileName}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{doc.createdAt || '—'}</p>
                                </div>
                                <button
                                  onClick={() => handleViewDocument(doc.claimId, doc.id)}
                                  className="p-2 text-slate-300 hover:text-[#0D0D12] hover:bg-white rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      <button
                        onClick={() => toast.info('Internal audit trail initiated')}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
                      >
                        <FileSearch className="w-4 h-4" />
                        Internal Audit
                      </button>
                    </div>
                </>
              </div>

              {/* Right Column - AI + Actions */}
              <div className="bg-[#0D0D12] rounded-[32px] p-8 border border-slate-800 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                {claimAction === null ? (
                  <>
                    {/* AI Assessment */}
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

                    <div className="mt-8 pt-8 border-t border-white/10 space-y-3 relative z-10">
                      <button
                        onClick={handleAcceptClaim}
                        disabled={isToggling}
                        className="w-full py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all text-xs disabled:opacity-50"
                      >
                        {isToggling ? 'Processing...' : 'Accept Claim'}
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setClaimAction('reject')}
                          className="flex-1 py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all text-xs"
                        >
                          Reject Claim
                        </button>
                        <button
                          onClick={() => setClaimAction('settle')}
                          className="flex-1 py-4 bg-white text-[#0D0D12] rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl text-xs"
                        >
                          Settle Account
                        </button>
                      </div>
                    </div>
                  </>
                ) : claimAction === 'reject' ? (
                  /* Reject Form */
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <button onClick={() => setClaimAction(null)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <h4 className="font-bold text-white tracking-tight">Reject Claim</h4>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                        <p className="text-rose-400 text-sm font-bold">You are about to reject claim CLM-{selectedClaim.claimId} for ₦{(selectedClaim.claimAmount ?? 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Reason for Rejection *</label>
                        <textarea
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Provide detailed reason for claim rejection..."
                          rows={4}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => { setClaimAction(null); setRejectReason(''); }}
                        className="flex-1 py-4 bg-white/5 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmReject}
                        disabled={isToggling}
                        className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all text-xs shadow-xl disabled:opacity-50"
                      >
                        {isToggling ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Settle Form */
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <button onClick={() => setClaimAction(null)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <h4 className="font-bold text-white tracking-tight">Settle Claim</h4>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <p className="text-emerald-400 text-sm font-bold">Settlement for CLM-{selectedClaim.claimId} — ₦{(selectedClaim.claimAmount ?? 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Recipient Account Name *</label>
                        <input
                          type="text"
                          value={settleAccountName}
                          onChange={e => setSettleAccountName(e.target.value)}
                          placeholder="Account holder name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Recipient Account Number *</label>
                        <input
                          type="text"
                          value={settleAccountNumber}
                          onChange={e => setSettleAccountNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="0000000000"
                          maxLength={10}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Recipient Bank *</label>
                        <select
                          value={settleBankCode}
                          onChange={e => setSettleBankCode(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="" className="bg-[#0D0D12]">Select a bank</option>
                          {banks.map(bank => (
                            <option key={bank.bankCode} value={bank.bankCode} className="bg-[#0D0D12]">
                              {bank.bankName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => { setClaimAction(null); setSettleAccountName(''); setSettleAccountNumber(''); setSettleBankCode(''); }}
                        className="flex-1 py-4 bg-white/5 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmSettle}
                        disabled={isToggling}
                        className="flex-1 py-4 bg-white text-[#0D0D12] rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-xs shadow-xl disabled:opacity-50"
                      >
                        {isToggling ? 'Processing...' : 'Confirm Settlement'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;
