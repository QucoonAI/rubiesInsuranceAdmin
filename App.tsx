
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Subscriptions from './components/Subscriptions';
import Payments from './components/Payments';
import Claims from './components/Claims';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import Login from './components/Login';
import { Search, Bell, X, CheckCheck, Plus, UserPlus, FilePlus, Zap, PieChart } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setIsQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'customers': return <Customers />;
      case 'subscriptions': return <Subscriptions />;
      case 'payments': return <Payments />;
      case 'claims': return <Claims />;
      case 'settings': return <Settings />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard />;
    }
  };

  const navigateToAction = (tab: string) => {
    setActiveTab(tab);
    setIsQuickActionsOpen(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const mockQuickNotifs = [
    { id: 1, title: 'New Claim Submitted', time: '5m ago', type: 'urgent' },
    { id: 2, title: 'Premium Payment Received', time: '1h ago', type: 'info' },
    { id: 3, title: 'Policy Renewal Pending', time: '3h ago', type: 'warning' },
  ];

  const quickActions = [
    { id: 'new-claim', label: 'New Claim', icon: FilePlus, tab: 'claims', shortcut: 'C' },
    { id: 'add-customer', label: 'Add Customer', icon: UserPlus, tab: 'customers', shortcut: 'U' },
    { id: 'reconcile', label: 'Reconcile Payment', icon: Zap, tab: 'payments', shortcut: 'R' },
    { id: 'report', label: 'Generate Report', icon: PieChart, tab: 'dashboard', shortcut: 'P' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden animate-in fade-in duration-700">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="hover:text-slate-600 cursor-pointer">Admin</span>
            <span>/</span>
            <span className="capitalize font-medium text-slate-800">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all text-slate-800"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick Actions Menu */}
              <div className="relative" ref={quickActionsRef}>
                <button 
                  onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                  className={`flex items-center gap-2 px-3 py-2 transition-all rounded-xl font-bold text-sm ${
                    isQuickActionsOpen 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  <Plus className={`w-5 h-5 transition-transform duration-300 ${isQuickActionsOpen ? 'rotate-45' : ''}`} />
                  <span className="hidden sm:inline">Actions</span>
                </button>

                {isQuickActionsOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Quick Commands</h4>
                    </div>
                    <div className="p-2">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => navigateToAction(action.tab)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-white border border-slate-100 rounded-lg group-hover:bg-white group-hover:border-blue-100 shadow-sm">
                            <action.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-800">{action.label}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-blue-300">
                            ⌘{action.shortcut}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Menu */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative p-2 transition-all rounded-xl ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-800'}`}
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Recent Alerts</h4>
                      <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Mark All
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockQuickNotifs.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                              notif.type === 'urgent' ? 'text-rose-500' :
                              notif.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                            }`}>
                              {notif.type}
                            </span>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{notif.title}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('notifications');
                        setIsNotifOpen(false);
                      }}
                      className="w-full py-4 text-center text-sm font-bold text-blue-600 bg-white hover:bg-slate-50 transition-colors border-t border-slate-100"
                    >
                      See all notifications
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">Sarah Jenkins</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
                SJ
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
