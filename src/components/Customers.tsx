
import React, { useState } from 'react';
import { Search, Download, UserPlus, ChevronRight, RefreshCw, X, Send, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { customerServiceApi } from '@/service/api/CustomerServiceApi';
import { ApiUser } from '@/types/api';
import { toast } from 'sonner';

const notificationTemplates = [
  { id: 'general', label: 'General Notice', subject: '', body: '' },
];

const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, isFetching, refetch } = customerServiceApi.useGetCustomersQuery({
    page: page.toString(),
    size: pageSize.toString(),
    ...(searchQuery ? { search: searchQuery } : {}),
  });
  const customers = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const [sendNotification, { isLoading: isSending }] = customerServiceApi.useSendNotificationMutation();

  // Customer detail drawer
  const [selectedCustomer, setSelectedCustomer] = useState<ApiUser | null>(null);

  // Notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notifRecipient, setNotifRecipient] = useState<'single' | 'all'>('single');
  const [notifCustomer, setNotifCustomer] = useState<ApiUser | null>(null);
  const [notifTemplate, setNotifTemplate] = useState('general');
  const [notifSubject, setNotifSubject] = useState('');
  const [notifBody, setNotifBody] = useState('');

  // New client modal
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const handleSelectTemplate = (templateId: string) => {
    setNotifTemplate(templateId);
    const tmpl = notificationTemplates.find(t => t.id === templateId);
    if (tmpl) {
      setNotifSubject(tmpl.subject);
      setNotifBody(tmpl.body);
    }
  };

  const handleSendNotification = async () => {
    if (!notifSubject.trim() || !notifBody.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }
    try {
      await sendNotification({
        subject: notifSubject,
        message: notifBody,
        ...(notifRecipient === 'single' && notifCustomer ? { userId: notifCustomer.userId.toString() } : {}),
      }).unwrap();
      const target = notifRecipient === 'all' ? 'all customers' : (notifCustomer?.userEmail || 'selected customer');
      toast.success(`Notification sent to ${target}`);
      setShowNotification(false);
      setNotifSubject('');
      setNotifBody('');
      setNotifCustomer(null);
    } catch {
      toast.error('Failed to send notification');
    }
  };

  const handleCreateClient = () => {
    if (!newClient.firstName || !newClient.lastName || !newClient.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Client ${newClient.firstName} ${newClient.lastName} created`);
    setShowNewClient(false);
    setNewClient({ firstName: '', lastName: '', email: '', phone: '' });
  };

  const openNotificationFor = (customer: ApiUser) => {
    setNotifRecipient('single');
    setNotifCustomer(customer);
    setShowNotification(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Customer Intelligence</h2>
          <p className="text-slate-500 font-medium">Manage and audit client portfolios for global compliance.</p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D0D12] w-64 text-slate-800"
            />
          </form>
          <button
            onClick={() => exportToCSV(customers, 'rubies_insure_customers')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowNewClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-300 transition-all text-sm"
          >
            <UserPlus className="w-4 h-4" />
            New Client
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load customers</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Customer Entity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Phone</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Joined</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={5} className="px-6 py-5">
                    <div className="animate-pulse bg-slate-100 rounded-lg h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-sm">No customers found</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.userId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#0D0D12] font-black shadow-sm group-hover:bg-[#0D0D12] group-hover:text-white transition-all duration-300">
                        {(customer.userFirstName ?? '?').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0D0D12]">{customer.userFirstName} {customer.userLastName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{customer.userEmail ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{customer.userNumber ?? '—'}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{customer.userCreatedAt ?? '—'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      customer.userStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      customer.userStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {customer.userStatus ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openNotificationFor(customer)}
                        className="p-2 text-slate-300 hover:text-[#0D0D12] hover:bg-slate-100 rounded-xl transition-all"
                        title="Send Notification"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 text-slate-300 hover:text-[#0D0D12] hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {totalSize} total customers
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
              disabled={customers.length < pageSize}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-[#0D0D12]/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0D0D12] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl">
                  {(selectedCustomer.userFirstName ?? '?').charAt(0)}{(selectedCustomer.userLastName ?? '?').charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0D0D12] tracking-tight">{selectedCustomer.userFirstName} {selectedCustomer.userLastName}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedCustomer.userType || 'Customer'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  selectedCustomer.userStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                  selectedCustomer.userStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {selectedCustomer.userStatus ?? '—'}
                </span>
                {selectedCustomer.ninVerified && (
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                    NIN Verified
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0D0D12]">{selectedCustomer.userEmail || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0D0D12]">{selectedCustomer.userNumber || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0D0D12]">{selectedCustomer.userAddress || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Personal Details</h4>
                <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-bold">Gender</span>
                    <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userGender || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-bold">Date of Birth</span>
                    <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userDateOfBirth || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-bold">Occupation</span>
                    <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userOccupation || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-bold">NIN</span>
                    <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userNin || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-bold">Customer Since</span>
                    <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userCreatedAt || '—'}</span>
                  </div>
                </div>
              </div>

              {/* KYC Status */}
              <div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Compliance</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-2xl border ${selectedCustomer.userDetailsProvided ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <Shield className={`w-5 h-5 mb-2 ${selectedCustomer.userDetailsProvided ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-black text-[#0D0D12]">Details Provided</p>
                    <p className="text-[10px] text-slate-400 font-bold">{selectedCustomer.userDetailsProvided ? 'Complete' : 'Incomplete'}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${selectedCustomer.ninVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <Shield className={`w-5 h-5 mb-2 ${selectedCustomer.ninVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-black text-[#0D0D12]">NIN Verified</p>
                    <p className="text-[10px] text-slate-400 font-bold">{selectedCustomer.ninVerified ? 'Verified' : 'Pending'}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${selectedCustomer.nextOfKinVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <Shield className={`w-5 h-5 mb-2 ${selectedCustomer.nextOfKinVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-black text-[#0D0D12]">Next of Kin</p>
                    <p className="text-[10px] text-slate-400 font-bold">{selectedCustomer.nextOfKinVerified ? 'Verified' : 'Pending'}</p>
                  </div>
                </div>
              </div>

              {/* Next of Kin */}
              {(selectedCustomer.userNextOfKinName || selectedCustomer.userNextOfKinNumber) && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-4">Next of Kin</h4>
                  <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Name</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userNextOfKinName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Phone</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userNextOfKinNumber || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold">Email</span>
                      <span className="text-sm font-bold text-[#0D0D12]">{selectedCustomer.userNextOfKinEmail || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { openNotificationFor(selectedCustomer); setSelectedCustomer(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
              >
                <Send className="w-4 h-4" />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Send Notification</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Push notifications to customer email</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Recipient */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Recipient</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNotifRecipient('single')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                      notifRecipient === 'single' ? 'bg-[#0D0D12] text-white border-[#0D0D12]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Single Customer
                  </button>
                  <button
                    onClick={() => setNotifRecipient('all')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                      notifRecipient === 'all' ? 'bg-[#0D0D12] text-white border-[#0D0D12]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Customers
                  </button>
                </div>
                {notifRecipient === 'single' && notifCustomer && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0D0D12] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {(notifCustomer.userFirstName ?? '?').charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0D0D12]">{notifCustomer.userFirstName} {notifCustomer.userLastName}</p>
                      <p className="text-[10px] text-slate-400">{notifCustomer.userEmail}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Template */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {notificationTemplates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t.id)}
                      className={`p-3 rounded-xl text-sm font-bold border transition-all text-left ${
                        notifTemplate === t.id ? 'bg-[#0D0D12] text-white border-[#0D0D12]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subject *</label>
                <input
                  type="text"
                  value={notifSubject}
                  onChange={e => setNotifSubject(e.target.value)}
                  placeholder="Notification subject..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message *</label>
                <textarea
                  value={notifBody}
                  onChange={e => setNotifBody(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowNotification(false)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                disabled={isSending}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {showNewClient && (
        <div className="fixed inset-0 bg-[#0D0D12]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#0D0D12] tracking-tighter">New Client</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Register a new customer</p>
              </div>
              <button onClick={() => setShowNewClient(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newClient.firstName}
                    onChange={e => setNewClient(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={newClient.lastName}
                    onChange={e => setNewClient(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={e => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={e => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0D0D12] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowNewClient(false)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClient}
                className="px-6 py-3 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
