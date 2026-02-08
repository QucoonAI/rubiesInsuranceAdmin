
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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Policy Subscriptions</h2>
          <p className="text-slate-500">Manage unique policy IDs and generate performance reports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(mockSubscriptions, 'insureflow_subscriptions')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            <PieChart className="w-4 h-4" />
            Performance Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Policy ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Plan Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Premium</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockSubscriptions.map((sub) => (
                <tr key={sub.policyId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600">{sub.policyId}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{sub.customerName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sub.planName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">${sub.premium}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setViewingCert(sub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {viewingCert && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileCheck className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Policy Certificate</h3>
                  <p className="text-sm text-slate-500">{viewingCert.policyId}</p>
                </div>
              </div>
              <button onClick={() => setViewingCert(null)} className="p-2 hover:bg-slate-200 rounded-full">
                <MoreHorizontal className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-12 space-y-8 bg-white border-[12px] border-slate-50 m-6 rounded-2xl relative">
              <div className="absolute top-8 right-8 text-slate-100 scale-[4] -z-10 opacity-20">
                <ShieldCheck className="w-32 h-32" />
              </div>
              
              <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Certificate of Insurance</h1>
                <p className="text-slate-500 uppercase tracking-[4px] text-xs">Official Document of Coverage</p>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div>
                  <label className="text-xs uppercase text-slate-400 font-bold mb-1 block">Policy Holder</label>
                  <p className="text-lg font-semibold text-slate-800">{viewingCert.customerName}</p>
                </div>
                <div>
                  <label className="text-xs uppercase text-slate-400 font-bold mb-1 block">Plan Selected</label>
                  <p className="text-lg font-semibold text-slate-800">{viewingCert.planName}</p>
                </div>
                <div>
                  <label className="text-xs uppercase text-slate-400 font-bold mb-1 block">Effective Date</label>
                  <p className="text-slate-800">{viewingCert.startDate}</p>
                </div>
                <div>
                  <label className="text-xs uppercase text-slate-400 font-bold mb-1 block">Premium Amount</label>
                  <p className="text-slate-800 font-bold">${viewingCert.premium} / Month</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 italic text-center">
                  This document serves as primary proof of active coverage as of {new Date().toLocaleDateString()}. 
                  The full policy terms and conditions are available on the mobile portal.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button className="px-6 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-100">
                Email Customer
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2">
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
