
import React from 'react';
import { 
  Users, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'claims', label: 'Claims', icon: AlertCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-white h-full border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-8 flex items-center gap-3 border-b border-slate-100 shrink-0">
        <img src="/logo.svg" alt="Rubies Insure" className="w-10 h-10 rounded-xl" />
        <h1 className="text-xl font-bold text-[#0D0D12] tracking-tighter">Rubies Insure</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-[#0D0D12] text-white shadow-xl shadow-slate-200' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-[#0D0D12]'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {item.id === 'notifications' && (
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'notifications' ? 'bg-white/20 text-white' : 'bg-[#0D0D12] text-white'
              }`}>3</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-1.5 border-t border-slate-100 shrink-0">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            activeTab === 'settings' 
            ? 'bg-[#0D0D12] text-white shadow-xl shadow-slate-200' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-[#0D0D12]'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="font-bold text-sm tracking-tight">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
