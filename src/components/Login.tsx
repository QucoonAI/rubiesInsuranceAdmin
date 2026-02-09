
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authServiceApi } from '@/service/api/AuthServiceApi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [adminLogin, { isLoading }] = authServiceApi.useAdminLoginMutation();
  const [resendOtp, { isLoading: isResending }] = authServiceApi.useResendOtpMutation();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminLogin({ email, password });
    if ('data' in result && result.data.responseCode === '00' && !result.data.token) {
      setStep('otp');
      setResendCooldown(60);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLogin({ email, password, otp });
  };

  const handleResendOtp = async () => {
    await resendOtp({ userEmail: email });
    setResendCooldown(60);
  };

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_m, start, middle, domain) => start + '*'.repeat(middle.length) + domain)
    : '';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfd] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0D0D12]/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[880px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-[40px] shadow-2xl shadow-slate-900/10 overflow-hidden relative z-10 m-4">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-[#0D0D12] text-white">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center gap-3 mb-16 relative z-10">
              <img src="/logo.svg" alt="Rubies Insure" className="w-12 h-12 rounded-2xl" />
              <span className="text-2xl font-black tracking-tighter italic">Rubies Insure</span>
            </div>
            <h2 className="text-5xl font-black leading-[1.1] mb-8 tracking-tighter">
              The premium <span className="text-slate-500 italic">standard</span> for risk management.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-sm">
              Global administration for claims adjudication and financial intelligence.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white/5 p-6 rounded-[28px] backdrop-blur-md border border-white/5 shadow-inner">
            <img src="/logo.svg" alt="Rubies Insure" className="w-12 h-12 rounded-2xl" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 leading-relaxed">Enterprise Security Protocol v2.4 Enabled</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          {step === 'credentials' ? (
            <>
              <div className="mb-8">
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
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0D0D12] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                      placeholder="admin@rubiesinsure.com"
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
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0D0D12] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
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
                  className="w-full py-3.5 bg-[#0D0D12] text-white rounded-[24px] font-black text-sm uppercase tracking-[4px] hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
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
            </>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-3xl font-black text-[#0D0D12] mb-3 tracking-tighter italic">VERIFICATION</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[4px]">Enter the code sent to your email</p>
              </div>

              <div className="mb-6 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2 bg-[#0D0D12] rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">OTP sent to</p>
                  <p className="text-sm font-black text-[#0D0D12]">{maskedEmail}</p>
                </div>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0D0D12] focus:bg-white transition-all text-[#0D0D12] font-black text-2xl text-center tracking-[12px] placeholder:text-slate-300 placeholder:tracking-[12px]"
                    placeholder="000000"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full py-3.5 bg-[#0D0D12] text-white rounded-[24px] font-black text-sm uppercase tracking-[4px] hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify & Enter
                      <ShieldCheck className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setOtp(''); }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#0D0D12] transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className="text-xs font-black text-[#0D0D12] hover:underline uppercase tracking-widest disabled:text-slate-300 disabled:no-underline transition-colors"
                  >
                    {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
