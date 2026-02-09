
import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight,
  Filter,
  Inbox
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'urgent' | 'info' | 'warning' | 'success';
  read: boolean;
  category: string;
}

const mockNotifications: NotificationItem[] = [
  { 
    id: '1', 
    title: 'High Risk Claim Detected', 
    description: 'Claim CLM-002 shows unusual patterns. AI processing suggests manual verification of hospital bills.', 
    time: '5 minutes ago', 
    type: 'urgent', 
    read: false,
    category: 'Claims'
  },
  { 
    id: '2', 
    title: 'Premium Payment Success', 
    description: 'Policyholder Emma Wilson (POL-11223) has successfully paid the monthly premium of $120.00.', 
    time: '1 hour ago', 
    type: 'success', 
    read: false,
    category: 'Payments'
  },
  { 
    id: '3', 
    title: 'Upcoming Policy Renewal', 
    description: 'Customer Bob Johnson (POL-44567) has a renewal date approaching in 14 days.', 
    time: '3 hours ago', 
    type: 'warning', 
    read: true,
    category: 'Customers'
  },
  { 
    id: '4', 
    title: 'System Security Patch', 
    description: 'The administrative portal has been updated to version 2.4.1. Security patches applied for data encryption.', 
    time: 'Yesterday', 
    type: 'info', 
    read: true,
    category: 'System'
  },
  { 
    id: '5', 
    title: 'Refund Processed', 
    description: 'A refund of $45.00 for Policy POL-99881 has been issued via Visa.', 
    time: '2 days ago', 
    type: 'success', 
    read: true,
    category: 'Payments'
  }
];

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(mockNotifications);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Inbox className="w-5 h-5 text-[#0D0D12]" />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    if (filter === 'Urgent') return n.type === 'urgent';
    return true;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight italic">System Broadcast</h2>
          <p className="text-slate-500 font-medium">Global activity log and neural alerts.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#0D0D12]" />
            <input 
              type="text" 
              placeholder="Search feed..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D0D12] w-64 text-slate-800"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-[#0D0D12] hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {['All', 'Unread', 'Urgent', 'Archive'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300 font-bold text-sm tracking-tight ${
                filter === tab 
                ? 'bg-[#0D0D12] text-white shadow-2xl shadow-slate-200' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span>{tab} Logs</span>
              {tab === 'Unread' && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${filter === 'Unread' ? 'bg-white/20' : 'bg-[#0D0D12] text-white'}`}>
                  2
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-10 px-4">
            <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[3px] mb-6 italic">Configuration</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Push Channel</span>
                <div className="w-8 h-4 bg-[#0D0D12] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Email relay</span>
                <div className="w-8 h-4 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-8 bg-white border rounded-[32px] transition-all hover:shadow-xl group relative overflow-hidden ${
                  notif.read ? 'border-slate-50' : 'border-slate-200 shadow-lg'
                }`}
              >
                {!notif.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0D0D12]"></div>}
                <div className="flex gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    notif.type === 'urgent' ? 'bg-rose-50' :
                    notif.type === 'warning' ? 'bg-amber-50' :
                    notif.type === 'success' ? 'bg-emerald-50' : 'bg-slate-50'
                  }`}>
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-[#0D0D12] tracking-tighter truncate italic">{notif.title}</h4>
                        {!notif.read && <span className="w-2.5 h-2.5 bg-[#0D0D12] rounded-full shadow-[0_0_10px_rgba(13,13,18,0.5)]"></span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                      {notif.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-400 rounded-lg uppercase tracking-[2px] border border-slate-200 group-hover:bg-[#0D0D12]/5 group-hover:text-[#0D0D12] group-hover:border-[#0D0D12]/10 transition-colors">
                          {notif.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button className="p-2.5 text-slate-300 hover:text-[#0D0D12] hover:bg-slate-100 rounded-xl transition-all">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0D12] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-lg shadow-slate-200 transition-all">
                          Respond <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-80 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[40px] text-center p-12 shadow-inner">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Bell className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-[#0D0D12] mb-2 tracking-tight italic">TERMINAL CLEAR</h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs">No pending Neural Alerts for the current security scope.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
