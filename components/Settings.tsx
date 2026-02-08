
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Save, 
  Smartphone, 
  Lock, 
  Globe,
  Check,
  Clock,
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';

const Settings: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  
  // Session State
  const [sessionDuration, setSessionDuration] = useState(900); // 15 minutes default
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [warningThreshold, setWarningThreshold] = useState(60); // 1 minute
  const [showWarning, setShowWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Timer Logic
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsExpired(true);
      setShowWarning(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next === warningThreshold) {
          setShowWarning(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, warningThreshold]);

  const handleExtendSession = () => {
    setTimeRemaining(sessionDuration);
    setShowWarning(false);
    setIsExpired(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const sessionPercentage = (timeRemaining / sessionDuration) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500">Manage your administrative profile and security preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
            isSaved ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
          }`}
        >
          {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaved ? 'Settings Saved' : 'Save Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Administrative Profile</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Sarah Jenkins" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Role</label>
                <input 
                  type="text" 
                  defaultValue="Super Admin" 
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Session Management Section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Session Security</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Current Session Active</p>
                  <p className="text-sm text-slate-500">Your session automatically terminates after a period of inactivity.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-blue-600">{formatTime(timeRemaining)}</div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Remaining</p>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    timeRemaining < warningThreshold ? 'bg-rose-500' : 'bg-blue-600'
                  }`} 
                  style={{ width: `${sessionPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Auto-Logout Timer</label>
                  <select 
                    value={sessionDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSessionDuration(val);
                      setTimeRemaining(val);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={300}>5 Minutes (Demo)</option>
                    <option value={900}>15 Minutes</option>
                    <option value={1800}>30 Minutes</option>
                    <option value={3600}>1 Hour</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Warning Threshold</label>
                  <select 
                    value={warningThreshold}
                    onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={30}>30 Seconds</option>
                    <option value={60}>1 Minute</option>
                    <option value={300}>5 Minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Security Summary */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Security Check</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">MFA Status</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Verified</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Last Login</span>
                </div>
                <span className="text-xs font-medium text-slate-500">2h ago</span>
              </div>
            </div>
          </section>

          {/* Localization */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Localization</h3>
            </div>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800">
              <option>English (United States)</option>
              <option>French (European)</option>
            </select>
          </section>
        </div>
      </div>

      {/* Timeout Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl border border-amber-100 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <AlertTriangle className="w-10 h-10 text-amber-500" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-transparent animate-spin"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Session Expiring</h3>
              <p className="text-slate-500 mb-8">
                Your administrative session will automatically terminate in 
                <span className="font-bold text-rose-600 ml-1">{timeRemaining} seconds</span>. 
                Save your work or extend the session now.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleExtendSession}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Extend Session
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Log Out Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Expired Overlay */}
      {isExpired && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[110] flex items-center justify-center p-4">
          <div className="text-center text-white max-w-sm">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Session Expired</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              For your security, your session has been terminated due to inactivity. 
              Please log in again to continue managing the portal.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-2xl"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
