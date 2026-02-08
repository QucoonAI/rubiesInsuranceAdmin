
import React from 'react';
import { 
  Users, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  LayoutDashboard,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'claims', label: 'Claims', icon: AlertCircle },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">InsureFlow</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
              ? 'bg-blue-50 text-blue-700 shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
