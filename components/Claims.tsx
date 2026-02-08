
import React, { useState } from 'react';
import { 
  FileSearch, MessageSquare, CheckCircle, XCircle, FileText, 
  ArrowRight, ShieldAlert, Download, BrainCircuit
} from 'lucide-react';
import { Claim } from '../types';
import { geminiService } from '../services/geminiService';
import { exportToCSV } from '../utils/csvExport';

const mockClaims: Claim[] = [
  { id: 'CLM-001', policyId: 'POL-88210', customerName: 'John Doe', amount: 5000, status: 'Registered', dateReported: '2024-02-15', docs: ['id_card.pdf', 'hospital_bill.pdf'], description: 'Sudden illness requiring hospitalization for 3 days.' },
  { id: 'CLM-002', policyId: 'POL-99122', customerName: 'Alice Smith', amount: 1200, status: 'Reported', dateReported: '2024-03-01', docs: ['photo_car.jpg', 'police_report.pdf'], description: 'Minor bumper damage in parking lot collision.' },
  { id: 'CLM-003', policyId: 'POL-44567', customerName: 'Bob Johnson', amount: 25000, status: 'Settled', dateReported: '2023-11-20', docs: ['death_cert.pdf', 'beneficiary_id.pdf'], description: 'Maturity of savings plan benefit payout.' },
  { id: 'CLM-004', policyId: 'POL-11223', customerName: 'Emma Wilson', amount: 800, status: 'Rejected', dateReported: '2024-01-10', docs: [], description: 'Claim for normal wear and tear on property (excluded).' },
];

const Claims: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const runAiAnalysis = async (claim: Claim) => {
    setAnalyzing(true);
    try {
      const result = await geminiService.analyzeClaim(claim.description, claim.docs);
      setAiAnalysis(result || '');
    } catch (e) {
      setAiAnalysis('Analysis failed. Please review manually.');
    }
    setAnalyzing(false);
  };

  const handleOpenClaim = (claim: Claim) => {
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
            onClick={() => exportToCSV(mockClaims, 'insureflow_claims')}
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

      {/* Pipeline Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Reported', count: 12, color: 'bg-[#0D0D12]' },
          { label: 'Registered', count: 8, color: 'bg-[#0D0D12]/60' },
          { label: 'Outstanding', count: 15, color: 'bg-amber-500' },
          { label: 'Settled', count: 42, color: 'bg-emerald-500' },
          { label: 'Rejected', count: 5, color: 'bg-rose-500' },
        ].map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group hover:shadow-lg transition-all">
            <div className={`w-8 h-1 rounded-full ${step.color} mb-4`} />
            <div className="text-3xl font-black text-[#0D0D12] tracking-tighter">{step.count}</div>
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
            {mockClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5 font-mono text-xs font-bold text-slate-400 group-hover:text-[#0D0D12]">{claim.id}</td>
                <td className="px-6 py-5 font-bold text-[#0D0D12]">{claim.customerName}</td>
                <td className="px-6 py-5 font-black text-[#0D0D12]">${claim.amount.toLocaleString()}</td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    claim.status === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    claim.status === 'Registered' ? 'bg-[#0D0D12]/5 text-[#0D0D12] border-[#0D0D12]/10' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-500">{claim.dateReported}</td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => handleOpenClaim(claim)}
                    className="p-2 bg-slate-100 text-[#0D0D12] rounded-xl hover:bg-[#0D0D12] hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
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
                  <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter uppercase italic">{selectedClaim.id} — Portfolio Review</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjusting valuation: <span className="text-[#0D0D12]">${selectedClaim.amount.toLocaleString()}.00</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Case Deposition</h4>
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-[28px] border border-slate-100 italic">
                    "{selectedClaim.description}"
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Digital Evidence</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedClaim.docs.length > 0 ? selectedClaim.docs.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-[20px] hover:border-[#0D0D12] cursor-pointer transition-all group">
                        <div className="flex items-center gap-4">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#0D0D12]" />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-[#0D0D12]">{doc}</span>
                        </div>
                        <Download className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[20px] text-center">
                        <p className="text-sm text-slate-300 font-bold uppercase tracking-widest">No evidence uploaded</p>
                      </div>
                    )}
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
