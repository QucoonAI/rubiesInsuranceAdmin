
import React, { useState } from 'react';
import { User, Shield, Lock, UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store';
import { authServiceApi } from '@/service/api/AuthServiceApi';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const loginDetails = useAppSelector(state => state.auth.loginDetails);

  // Change Password
  const [changePassword, { isLoading: isChangingPw }] = authServiceApi.useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Invite Admin
  const [inviteAdmin, { isLoading: isInviting }] = authServiceApi.useInviteAdminMutation();
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        oldPassword,
        userPassword: newPassword,
        username: loginDetails?.userEmail || '',
      }).unwrap();
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to change password');
    }
  };

  const handleInviteAdmin = async () => {
    if (!inviteFirstName.trim() || !inviteLastName.trim() || !inviteEmail.trim() || !invitePhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await inviteAdmin({
        adminFirstName: inviteFirstName.trim(),
        adminLastName: inviteLastName.trim(),
        adminEmail: inviteEmail.trim(),
        adminPhoneNumber: invitePhone.trim(),
      }).unwrap();
      toast.success('Admin invitation sent successfully');
      setInviteFirstName('');
      setInviteLastName('');
      setInviteEmail('');
      setInvitePhone('');
    } catch {
      toast.error('Failed to send admin invitation');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-[#0D0D12] tracking-tight">Settings</h2>
        <p className="text-slate-500 font-medium">Manage your profile, security, and team access.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile + Change Password */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl shadow-inner border border-slate-100">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0D0D12] tracking-tight">Profile</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account information</p>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Full Name</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0D0D12] font-bold">
                  {loginDetails?.userFirstName || ''} {loginDetails?.userLastName || ''}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Email</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0D0D12] font-bold truncate">
                  {loginDetails?.userEmail || '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Phone</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0D0D12] font-bold">
                  {loginDetails?.userNumber || '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Role</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0D0D12] font-bold">
                  {loginDetails?.userType || '—'}
                </div>
              </div>
            </div>
          </section>

          {/* Change Password Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl shadow-inner border border-slate-100">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0D0D12] tracking-tight">Change Password</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update your credentials</p>
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPw ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                  />
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPw}
                className="px-8 py-4 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isChangingPw && <Loader2 className="w-4 h-4 animate-spin" />}
                {isChangingPw ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column - Invite Admin */}
        <div className="space-y-8">
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl shadow-inner border border-slate-100">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0D0D12] tracking-tight">Invite Admin</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add a team member</p>
              </div>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">First Name *</label>
                <input
                  type="text"
                  value={inviteFirstName}
                  onChange={e => setInviteFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Last Name *</label>
                <input
                  type="text"
                  value={inviteLastName}
                  onChange={e => setInviteLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Email *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">Phone Number *</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={e => setInvitePhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="08012345678"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0D0D12] transition-all outline-none text-[#0D0D12] font-bold"
                />
              </div>
              <button
                onClick={handleInviteAdmin}
                disabled={isInviting}
                className="w-full py-4 bg-[#0D0D12] text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isInviting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isInviting ? 'Sending Invite...' : 'Send Invitation'}
              </button>
            </div>
          </section>

          {/* Security Info */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-50 text-[#0D0D12] rounded-2xl border border-slate-100">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-black text-[#0D0D12] tracking-tight text-sm">Account Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Status</span>
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                  loginDetails?.userStatus === 'ACTIVE' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-200'
                }`}>
                  {loginDetails?.userStatus || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Joined</span>
                <span className="text-xs font-bold text-[#0D0D12]">
                  {loginDetails?.userCreatedAt ? new Date(loginDetails.userCreatedAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
