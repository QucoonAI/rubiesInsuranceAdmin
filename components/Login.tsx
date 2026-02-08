
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@insureflow.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfd] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0D0D12]/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-[40px] shadow-2xl shadow-slate-900/10 overflow-hidden relative z-10 m-4">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex flex-col justify-between p-16 bg-[#0D0D12] text-white">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center gap-3 mb-16 relative z-10">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">InsureFlow</span>
            </div>
            <h2 className="text-5xl font-black leading-[1.1] mb-8 tracking-tighter">
              The premium <span className="text-slate-500 italic">standard</span> for risk management.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-sm">
              Global administration for claims adjudication and financial intelligence.
            </p>
          </div>
          
          <div className="flex items-center gap-5 bg-white/5 p-6 rounded-[28px] backdrop-blur-md border border-white/5 shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 leading-relaxed">Enterprise Security Protocol v2.4 Enabled</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-[#0D0D12] mb-3 tracking-tighter italic">AUTHENTICATION</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[4px]">Access Secure Terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Operator ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#0D0D12] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0D0D12] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  placeholder="admin@insureflow.io"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Encrypted Key</label>
                <a href="#" className="text-[10px] font-black text-[#0D0D12] hover:underline uppercase tracking-widest">Reset</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#0D0D12] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0D0D12] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-[#0D0D12] focus:ring-[#0D0D12]" />
              <label htmlFor="remember" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Persist Session</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#0D0D12] text-white rounded-[24px] font-black text-sm uppercase tracking-[4px] hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px]">
              <span className="px-6 bg-white text-slate-300 font-black uppercase tracking-[3px]">Alternative Channels</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-[20px] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
              <Chrome className="w-4 h-4" />
              Chrome
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-[20px] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
