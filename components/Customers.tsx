
import React, { useState } from 'react';
import { Search, Bell, Mail, Filter, Send, Download } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Customer } from '../types';
import { exportToCSV } from '../utils/csvExport';

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', policyType: 'Life Insurance', renewalDate: '2024-12-15', status: 'Active', maturityDate: '2035-06-12' },
  { id: '2', name: 'Alice Smith', email: 'alice@company.com', phone: '+1 345 678 901', policyType: 'Health Premium', renewalDate: '2024-05-10', status: 'Pending', maturityDate: '2029-01-01' },
  { id: '3', name: 'Bob Johnson', email: 'bob.j@web.net', phone: '+1 456 789 012', policyType: 'Savings Plan', renewalDate: '2025-01-20', status: 'Active', maturityDate: '2030-01-20' },
  { id: '4', name: 'Emma Wilson', email: 'emma@domain.io', phone: '+1 567 890 123', policyType: 'Property Protect', renewalDate: '2024-03-12', status: 'Inactive', maturityDate: '2024-03-12' },
];

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [notificationType, setNotificationType] = useState('Renewal Reminder');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotify = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoading(true);
    setGeneratedContent('');
    try {
      const detail = `Renewal Date: ${customer.renewalDate}, Policy: ${customer.policyType}`;
      const content = await geminiService.generateNotification({
        type: notificationType,
        customerName: customer.name,
        detail
      });
      setGeneratedContent(content || '');
    } catch (e) {
      setGeneratedContent('Error generating content.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customer Base</h2>
          <p className="text-slate-500">Access client details for strategic and compliance purposes.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-slate-800"
            />
          </div>
          <button 
            onClick={() => exportToCSV(mockCustomers, 'insureflow_customers')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Policy Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Renewal Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.policyType}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.renewalDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 
                    customer.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleNotify(customer)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all ml-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notification Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Push Notification</h3>
                  <p className="text-slate-500">Drafting alert for {selectedCustomer.name}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message Intent</label>
                  <select 
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option>Renewal Reminder</option>
                    <option>Policy Maturity Notice</option>
                    <option>Premium Change</option>
                    <option>Strategic Update</option>
                  </select>
                </div>

                <div className="relative min-h-[160px] bg-slate-50 rounded-2xl border border-slate-200 p-4">
                  {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-sm text-slate-500">AI drafting content...</span>
                    </div>
                  ) : (
                    <textarea 
                      className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-800"
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      placeholder="AI generated content will appear here..."
                    />
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Push Alert
                </button>
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

export default Customers;
