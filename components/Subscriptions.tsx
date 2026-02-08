
import React, { useState } from 'react';
import { Download, Eye, FileCheck, Search, Filter, PieChart } from 'lucide-react';
import { Subscription } from '../types';
import { exportToCSV } from '../utils/csvExport';

const mockSubscriptions: Subscription[] = [
  { policyId: 'POL-88210', customerId: 'C1', customerName: 'John Doe', planName: 'Executive Life', premium: 250, startDate: '2023-12-15', status: 'Active', certificateUrl: '#' },
  { policyId: 'POL-99122', customerId: 'C2', customerName: 'Alice Smith', planName: 'Gold Health', premium: 180, startDate: '2024-01-10', status: 'Active', certificateUrl: '#' },
  { policyId: 'POL-44567', customerId: 'C3', customerName: 'Bob Johnson', planName: 'RetireEasy Savings', premium: 500, startDate: '2024-02-05', status: 'Pending', certificateUrl: '#' },
  { policyId: 'POL-11223', customerId: 'C4', customerName: 'Emma Wilson', planName: 'Home Secure', premium: 120, startDate: '2023-05-12', status: 'Active', certificateUrl: '#' },
];

const Subscriptions: React.FC = () => {
  const [viewingCert, setViewingCert] = useState<Subscription | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Active Underwriting</h2>
          <p className="text-slate-500 font-medium">Verify policy distributions and generate risk reports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(mockSubscriptions, 'insureflow_subscriptions')}
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

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Class</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Vault</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockSubscriptions.map((sub) => (
              <tr key={sub.policyId} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#0D0D12]">{sub.policyId}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{sub.customerName}</div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-500">{sub.planName}</td>
                <td className="px-6 py-4 text-sm font-black text-[#0D0D12]">${sub.premium}</td>
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
            ))}
          </tbody>
        </table>
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px]">{viewingCert.policyId}</p>
                </div>
              </div>
              <button onClick={() => setViewingCert(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-12 space-y-8 bg-white border-[12px] border-slate-50 m-6 rounded-[32px] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 scale-[5] -z-10 opacity-30">
                <ShieldCheck className="w-32 h-32" />
              </div>
              
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-[#0D0D12] mb-1 tracking-tighter italic">CERTIFICATE</h1>
                <p className="text-slate-400 uppercase tracking-[5px] text-[10px] font-bold">Official Coverage Record</p>
              </div>

              <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Policy Holder</label>
                  <p className="text-xl font-black text-[#0D0D12] tracking-tight">{viewingCert.customerName}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Plan Designation</label>
                  <p className="text-xl font-black text-[#0D0D12] tracking-tight">{viewingCert.planName}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Effective Term</label>
                  <p className="font-bold text-slate-600">{viewingCert.startDate}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-300 font-black mb-1 block tracking-widest">Monthly Commitment</label>
                  <p className="text-[#0D0D12] font-black text-lg">${viewingCert.premium}.00</p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                  Issued by InsureFlow Corporate Security. This electronic record is cryptographically signed and legally binding.
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

// Internal icons for the certificate
const ShieldCheck: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MoreHorizontal: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Subscriptions;
