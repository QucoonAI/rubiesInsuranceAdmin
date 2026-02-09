
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">System Environment</h2>
          <p className="text-slate-500 font-medium">Configure terminal security and operator profile.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
            isSaved ? 'bg-emerald-500 text-white' : 'bg-[#0D0D12] text-white hover:bg-black shadow-slate-200'
          }`}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Config Synced' : 'Commit Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl shadow-inner border border-slate-100">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0D0D12] tracking-tight uppercase italic">Operator Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Management</p>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Callsign</label>
                <input 
                  type="text" 
                  defaultValue="Sarah Jenkins" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Authorization</label>
                <input 
                  type="text" 
                  defaultValue="Super Admin" 
                  disabled
                  className="w-full px-5 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-bold"
                />
              </div>
            </div>
          </section>

          {/* Session Management Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl shadow-inner border border-slate-100">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0D0D12] tracking-tight uppercase italic">Secure Vault Session</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time-bound access control</p>
              </div>
            </div>
            <div className="p-10 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <p className="font-black text-[#0D0D12] tracking-tight italic">TERMINAL EXPIRY</p>
                  <p className="text-sm text-slate-400 font-medium">Session automatically terminates for data protection.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-[#0D0D12] tracking-tighter italic">{formatTime(timeRemaining)}</div>
                  <p className="text-[9px] uppercase font-black text-slate-300 tracking-[3px]">T-Minus</p>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    timeRemaining < warningThreshold ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-[#0D0D12]'
                  }`} 
                  style={{ width: `${sessionPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Expiry Interval</label>
                  <select 
                    value={sessionDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSessionDuration(val);
                      setTimeRemaining(val);
                    }}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] outline-none font-bold text-[#0D0D12]"
                  >
                    <option value={300}>5m Interval</option>
                    <option value={900}>15m Interval</option>
                    <option value={1800}>30m Interval</option>
                    <option value={3600}>60m Interval</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Warning Point</label>
                  <select 
                    value={warningThreshold}
                    onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] outline-none font-bold text-[#0D0D12]"
                  >
                    <option value={30}>30s Threshold</option>
                    <option value={60}>60s Threshold</option>
                    <option value={300}>300s Threshold</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Security Summary */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-50 text-rose-500 rounded-2xl border border-slate-100">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-black text-[#0D0D12] tracking-tight uppercase italic text-sm">Integrity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">MFA status</span>
                </div>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg uppercase tracking-widest">Secure</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Cycle</span>
                </div>
                <span className="text-[9px] font-black text-[#0D0D12] bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-widest italic">2h Ago</span>
              </div>
            </div>
          </section>

          {/* Localization */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-black text-[#0D0D12] tracking-tight uppercase italic text-sm">Region</h3>
            </div>
            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#0D0D12] outline-none text-[#0D0D12] appearance-none">
              <option>EN-US (GCP West)</option>
              <option>FR-EU (GCP Paris)</option>
            </select>
          </section>
        </div>
      </div>

      {/* Timeout Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-[#0D0D12]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl border border-amber-100 animate-in zoom-in-95 duration-300">
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
              </div>
              
              <h3 className="text-3xl font-black text-[#0D0D12] mb-3 tracking-tighter italic italic">SESSION ALERT</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Terminal connection will be severed in 
                <span className="font-black text-rose-600 ml-1 italic">{timeRemaining}s</span>. 
                Re-authorize or terminate immediately.
              </p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleExtendSession}
                  className="w-full py-5 bg-[#0D0D12] text-white rounded-[24px] font-black uppercase tracking-[3px] text-xs hover:bg-black shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Renew Token
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-[24px] font-black uppercase tracking-[3px] text-xs hover:bg-slate-100 transition-all"
                >
                  Sever Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Expired Overlay */}
      {isExpired && (
        <div className="fixed inset-0 bg-[#0D0D12] z-[110] flex items-center justify-center p-4 animate-in fade-in duration-1000">
          <div className="text-center text-white max-w-sm">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
              <LogOut className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-4xl font-black mb-6 tracking-tighter italic uppercase">ACCESS SEVERED</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Security protocol initiated. Inactivity threshold exceeded. 
              Terminal access has been revoked.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-white text-[#0D0D12] rounded-[24px] font-black uppercase tracking-[4px] text-xs hover:bg-slate-100 transition-all shadow-white/10 shadow-2xl"
            >
              Re-Authenticate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
