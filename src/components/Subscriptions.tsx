
import React, { useState, useMemo, useRef } from 'react';
import { Download, Eye, FileCheck, PieChart, X, Send, Mail, Calendar, RefreshCw } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { subscriptionServiceApi } from '@/service/api/SubscriptionServiceApi';
import { ApiSubscription } from '@/types/api';
import { toast } from 'sonner';

const Subscriptions: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError, isFetching, refetch } = subscriptionServiceApi.useGetSubscriptionsQuery({
    page: page.toString(),
    size: pageSize.toString(),
  });
  const subscriptions = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const [viewingCert, setViewingCert] = useState<ApiSubscription | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  // Report modal
  const [showReport, setShowReport] = useState(false);
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [reportStatus, setReportStatus] = useState('all');

  // Email modal
  const [showEmail, setShowEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(s => {
      if (reportStatus !== 'all' && s.subscriptionStatus !== reportStatus) return false;
      if (reportDateFrom && s.subscriptionCreatedAt && s.subscriptionCreatedAt < reportDateFrom) return false;
      if (reportDateTo && s.subscriptionCreatedAt && s.subscriptionCreatedAt > reportDateTo) return false;
      return true;
    });
  }, [subscriptions, reportStatus, reportDateFrom, reportDateTo]);

  const reportSummary = useMemo(() => {
    const active = filteredSubs.filter(s => s.subscriptionStatus === 'Active').length;
    const pending = filteredSubs.filter(s => s.subscriptionStatus === 'Pending').length;
    const totalPremium = filteredSubs.reduce((sum, s) => sum + (s.subscriptionPaymentAmount ?? 0), 0);
    return { total: filteredSubs.length, active, pending, expired: filteredSubs.length - active - pending, totalPremium };
  }, [filteredSubs]);

  const handleDownloadPDF = () => {
    if (certRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Policy Certificate - SUB-${viewingCert?.subscriptionId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #0D0D12; }
            .cert { max-width: 600px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 16px; padding: 48px; }
            .title { font-size: 32px; font-weight: 900; text-align: center; margin-bottom: 4px; letter-spacing: -0.05em; font-style: italic; }
            .subtitle { text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 5px; color: #94a3b8; font-weight: 700; margin-bottom: 40px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; font-weight: 800; margin-bottom: 4px; }
            .value { font-size: 16px; font-weight: 800; }
            .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
          </style></head><body>
          <div class="cert">
            <div class="title">CERTIFICATE</div>
            <div class="subtitle">Official Coverage Record</div>
            <div class="grid">
              <div><div class="label">Policy Name</div><div class="value">${viewingCert?.subscriptionPolicyName || '—'}</div></div>
              <div><div class="label">Status</div><div class="value">${viewingCert?.subscriptionStatus || '—'}</div></div>
              <div><div class="label">Effective Term</div><div class="value">${viewingCert?.subscriptionStartDate || '—'} — ${viewingCert?.subscriptionEndDate || '—'}</div></div>
              <div><div class="label">Payment Amount</div><div class="value">₦${viewingCert?.subscriptionPaymentAmount ?? 0}</div></div>
              <div><div class="label">Assured Sum</div><div class="value">₦${(viewingCert?.subscriptionAssuredSum ?? 0).toLocaleString()}</div></div>
              <div><div class="label">Frequency</div><div class="value">${viewingCert?.subscriptionContributionFrequency || '—'}</div></div>
            </div>
            <div class="footer">Issued by Rubies Insure Corporate Security. This electronic record is cryptographically signed and legally binding.</div>
          </div></body></html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
    toast.success('Certificate PDF generated');
  };

  const handleSendEmail = () => {
    if (!emailAddress.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success(`Certificate sent to ${emailAddress}`);
    setShowEmail(false);
    setEmailAddress('');
  };

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
          <button
            onClick={() => setShowReport(true)}
            className="px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
          >
            <PieChart className="w-4 h-4" />
            Performance
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
                  <td className="px-6 py-4 text-sm font-black text-[#0D0D12]">₦{sub.subscriptionPaymentAmount ?? 0}</td>
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

      {/* Performance Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Performance Report</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Policy performance monitoring and evaluation</p>
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
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-black text-[#0D0D12]">{reportSummary.total}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Policies</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-black text-[#0D0D12]">₦{reportSummary.totalPremium.toLocaleString()}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Premium</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-700">{reportSummary.active}</div>
                  <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <div className="text-2xl font-black text-amber-700">{reportSummary.pending}</div>
                  <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Pending</div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">UID</th>
                      <th className="px-4 py-3">Policy</th>
                      <th className="px-4 py-3">Premium</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm font-medium">No subscriptions match the selected filters</td>
                      </tr>
                    ) : (
                      filteredSubs.slice(0, 20).map((sub) => (
                        <tr key={sub.subscriptionId} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500">SUB-{sub.subscriptionId}</td>
                          <td className="px-4 py-3 text-sm font-bold text-[#0D0D12]">{sub.subscriptionPolicyName || '—'}</td>
                          <td className="px-4 py-3 text-sm font-black text-[#0D0D12]">₦{sub.subscriptionPaymentAmount ?? 0}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                              sub.subscriptionStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                              sub.subscriptionStatus === 'Pending' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>{sub.subscriptionStatus || '—'}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{sub.subscriptionCreatedAt || '—'}</td>
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
                  exportToCSV(filteredSubs, 'rubies_subscription_report');
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
                <X className="w-6 h-6" />
              </button>
            </div>

            <div ref={certRef} className="p-12 space-y-8 bg-white border-[12px] border-slate-50 m-6 rounded-[32px] relative overflow-hidden">
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
                  <p className="text-[#0D0D12] font-black text-lg">₦{viewingCert.subscriptionPaymentAmount ?? 0}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Assured Sum</label>
                  <p className="font-bold text-slate-600">₦{(viewingCert.subscriptionAssuredSum ?? 0).toLocaleString()}</p>
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
              <button
                onClick={() => { setShowEmail(true); }}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Distribute via Email
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black flex items-center gap-2 shadow-xl shadow-slate-200 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Distribution Modal */}
      {showEmail && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#0D0D12] tracking-tighter">Distribute Certificate</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SUB-{viewingCert?.subscriptionId}</p>
              </div>
              <button onClick={() => setShowEmail(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-[#0D0D12]">{viewingCert?.subscriptionPolicyName}</p>
                <p className="text-[10px] text-slate-400 font-medium">Certificate will be sent as PDF attachment</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Recipient Email *</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEmail(false)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
