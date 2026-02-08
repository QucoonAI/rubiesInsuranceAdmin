
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
      default: return <Inbox className="w-5 h-5 text-blue-500" />;
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
          <h2 className="text-2xl font-bold text-slate-800">Notification Center</h2>
          <p className="text-slate-500">Stay updated with system alerts, customer actions, and financial events.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-slate-800"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50">
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                filter === tab 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span className="font-semibold">{tab} Alerts</span>
              {tab === 'Unread' && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${filter === 'Unread' ? 'bg-white/20' : 'bg-rose-500 text-white'}`}>
                  2
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-8 px-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Notification Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Push Notifications</span>
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Email Summaries</span>
                <div className="w-8 h-4 bg-slate-300 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
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
                className={`p-6 bg-white border rounded-2xl transition-all hover:shadow-md group ${
                  notif.read ? 'border-slate-100' : 'border-blue-200 bg-blue-50/10 ring-1 ring-blue-100'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'urgent' ? 'bg-rose-50' :
                    notif.type === 'warning' ? 'bg-amber-50' :
                    notif.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
                  }`}>
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 truncate">{notif.title}</h4>
                        {!notif.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                      </div>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {notif.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-wider">
                          {notif.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                          Take Action <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl text-center p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">All caught up!</h3>
              <p className="text-sm text-slate-400">No new notifications for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
