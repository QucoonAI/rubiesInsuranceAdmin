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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Claims Processing</h2>
          <p className="text-slate-500">Manage the entire lifecycle from notification to settlement.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(mockClaims, 'insureflow_claims')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Strategic Claims Report
          </button>
        </div>
      </header>

      {/* Pipeline Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Reported', count: 12, color: 'bg-blue-500' },
          { label: 'Registered', count: 8, color: 'bg-indigo-500' },
          { label: 'Outstanding', count: 15, color: 'bg-amber-500' },
          { label: 'Settled', count: 42, color: 'bg-emerald-500' },
          { label: 'Rejected', count: 5, color: 'bg-rose-500' },
        ].map((step, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-8 h-1 rounded-full ${step.color} mb-3`} />
            <div className="text-2xl font-bold text-slate-800">{step.count}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{step.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Claim ID</th>
              <th className="px-6 py-4">Policy Holder</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Reported</th>
              <th className="px-6 py-4 text-right">Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{claim.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{claim.customerName}</td>
                <td className="px-6 py-4 font-bold text-slate-800">${claim.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    claim.status === 'Settled' ? 'bg-emerald-50 text-emerald-700' :
                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                    claim.status === 'Registered' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{claim.dateReported}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleOpenClaim(claim)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedClaim.id} — {selectedClaim.customerName}</h3>
                  <p className="text-sm text-slate-500">Processing claim worth ${selectedClaim.amount.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Claim Description</h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedClaim.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Supporting Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedClaim.docs.length > 0 ? selectedClaim.docs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all group">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        <span className="text-sm text-slate-600 truncate">{doc}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 italic">No documents submitted.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50">
                    <MessageSquare className="w-4 h-4" />
                    Message Client
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50">
                    <FileSearch className="w-4 h-4" />
                    Internal Logs
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-800">AI Claim Assessment</h4>
                  </div>
                  <button 
                    onClick={() => runAiAnalysis(selectedClaim)}
                    disabled={analyzing}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {analyzing ? 'Processing...' : 'Run Analysis'}
                  </button>
                </div>

                <div className="flex-1">
                  {analyzing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-500 text-sm">Validating documents and policy terms...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="prose prose-sm prose-slate">
                      <p className="whitespace-pre-wrap text-slate-600">
                        {aiAnalysis}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-8">
                      <p className="text-slate-400 text-sm italic">Click 'Run Analysis' to let Gemini evaluate the risk and validity of this claim.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                  <button className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                    <CheckCircle className="w-4 h-4" />
                    Accept & Settle
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

// Internal icon for generic usage
const MoreHorizontal: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Claims;