
import React, { useState, useMemo } from 'react';
import { Search, Download, RefreshCw, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';
import { complaintServiceApi } from '@/service/api/ComplaintServiceApi';
import { ApiComplaint } from '@/types/api';
import { toast } from 'sonner';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const Complaints: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, isFetching, refetch } = complaintServiceApi.useGetComplaintsQuery({
    page: page.toString(),
    size: pageSize.toString(),
    ...(searchQuery ? { search: searchQuery } : {}),
  });
  const complaints = data?.data ?? [];
  const totalSize = data?.totalSize ?? 0;

  const [toggleComplaintStatus, { isLoading: isToggling }] = complaintServiceApi.useToggleComplaintStatusMutation();

  const [selectedComplaint, setSelectedComplaint] = useState<ApiComplaint | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'RESOLVED' | 'REJECTED'; complaint: ApiComplaint } | null>(null);

  const pipelineCounts = useMemo(() => ({
    Open: data?.openCount ?? 0,
    Resolved: data?.resolvedCount ?? 0,
    Rejected: data?.rejectedCount ?? 0,
  }), [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const handleToggle = async () => {
    if (!confirmAction) return;
    try {
      await toggleComplaintStatus({
        complaintId: confirmAction.complaint.complaintId,
        action: confirmAction.type,
      }).unwrap();
      toast.success(`Complaint ${confirmAction.complaint.complaintCode || ''} has been ${confirmAction.type.toLowerCase()}`);
      setConfirmAction(null);
      setSelectedComplaint(null);
    } catch {
      toast.error(`Failed to ${confirmAction.type.toLowerCase()} complaint`);
    }
  };

  const handleExport = () => {
    if (!complaints.length) return;
    exportToCSV(complaints.map(c => ({
      'Complaint Code': c.complaintCode || '',
      'Description': c.complaintDescription || '',
      'Status': c.complaintStatus || '',
      'User ID': c.complaintUserId || '',
      'Created': c.complaintCreatedAt || '',
      'Updated': c.complaintUpdatedAt || '',
    })), 'complaints-export');
  };

  const totalPages = Math.ceil(totalSize / pageSize);

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'RESOLVED') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'REJECTED') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-amber-50 text-amber-700 border-amber-100';
  };

  const getStatusLabel = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'RESOLVED') return 'Resolved';
    if (s === 'REJECTED') return 'Rejected';
    return 'Open';
  };

  const isActionable = (status?: string) => {
    const s = (status || '').toUpperCase();
    return s !== 'RESOLVED' && s !== 'REJECTED';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0D0D12] tracking-tighter">Complaints & Disputes</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Track and resolve customer complaints and disputes.</p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0D0D12] w-56"
            />
          </form>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-[#0D0D12] hover:text-[#0D0D12] transition-all"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-[#0D0D12] hover:text-[#0D0D12] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Sync
          </button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-rose-50 border border-rose-100 rounded-[24px] p-6 text-center">
          <p className="text-rose-600 font-bold text-sm mb-2">Failed to load complaints</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-rose-700 underline">Retry</button>
        </div>
      )}

      {/* Pipeline Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', color: 'bg-[#0D0D12]' },
          { label: 'Resolved', color: 'bg-emerald-500' },
          { label: 'Rejected', color: 'bg-rose-500' },
        ].map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group hover:shadow-lg transition-all">
            <div className={`w-8 h-1 rounded-full ${step.color} mb-4`} />
            <div className={`text-3xl font-black text-[#0D0D12] tracking-tighter ${isLoading ? 'animate-pulse bg-slate-100 rounded w-12 h-9' : ''}`}>
              {isLoading ? '' : pipelineCounts[step.label as keyof typeof pipelineCounts] ?? 0}
            </div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                  No complaints found
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint.complaintId}
                  className="border-t border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <td className="px-6 py-4 font-bold text-sm text-[#0D0D12]">
                    {complaint.complaintCode || `#${complaint.complaintId}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {complaint.complaintDescription || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(complaint.complaintStatus)}`}>
                      {getStatusLabel(complaint.complaintStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{complaint.complaintUserId ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {complaint.complaintCreatedAt ? new Date(complaint.complaintCreatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-bold">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalSize)} of {totalSize}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-30 hover:border-[#0D0D12] transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-[#0D0D12] text-white rounded-xl text-sm font-bold">{page}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-30 hover:border-[#0D0D12] transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer (shadcn/vaul — right slide) */}
      <Drawer
        open={!!selectedComplaint}
        onOpenChange={(open) => { if (!open) setSelectedComplaint(null); }}
        direction="right"
        shouldScaleBackground={false}
      >
        <DrawerContent className="h-full w-full max-w-lg ml-auto rounded-none border-l border-slate-200">
          <DrawerHeader className="p-6 border-b border-slate-100">
            <DrawerTitle className="text-lg font-black text-[#0D0D12] tracking-tight">
              {selectedComplaint?.complaintCode || `Complaint #${selectedComplaint?.complaintId}`}
            </DrawerTitle>
            {selectedComplaint && (
              <span className={`inline-block w-fit mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(selectedComplaint.complaintStatus)}`}>
                {getStatusLabel(selectedComplaint.complaintStatus)}
              </span>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedComplaint && (
              <div className="bg-slate-50 rounded-[28px] p-6 space-y-4">
                <div>
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Complaint Code</label>
                  <p className="text-sm font-bold text-[#0D0D12] mt-1">{selectedComplaint.complaintCode || '—'}</p>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Description</label>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">{selectedComplaint.complaintDescription || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">User ID</label>
                    <p className="text-sm font-bold text-[#0D0D12] mt-1">{selectedComplaint.complaintUserId ?? '—'}</p>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Status</label>
                    <p className="text-sm font-bold text-[#0D0D12] mt-1">{getStatusLabel(selectedComplaint.complaintStatus)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Created</label>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedComplaint.complaintCreatedAt ? new Date(selectedComplaint.complaintCreatedAt).toLocaleString() : '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Updated</label>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedComplaint.complaintUpdatedAt ? new Date(selectedComplaint.complaintUpdatedAt).toLocaleString() : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {selectedComplaint && isActionable(selectedComplaint.complaintStatus) && (
            <DrawerFooter className="p-6 border-t border-slate-100 flex-row gap-3">
              <button
                onClick={() => setConfirmAction({ type: 'RESOLVED', complaint: selectedComplaint })}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-colors"
              >
                Resolve
              </button>
              <button
                onClick={() => setConfirmAction({ type: 'REJECTED', complaint: selectedComplaint })}
                className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Reject
              </button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      {/* Confirmation Modal (shadcn AlertDialog) */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent className="rounded-[32px] border-slate-200 bg-white p-0 gap-0 max-w-md">
          <div className="p-8">
            <AlertDialogHeader className="space-y-0">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${confirmAction?.type === 'RESOLVED' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <AlertTriangle className={`w-6 h-6 ${confirmAction?.type === 'RESOLVED' ? 'text-emerald-600' : 'text-rose-600'}`} />
                </div>
                <AlertDialogTitle className="text-lg font-black text-[#0D0D12] tracking-tight">
                  {confirmAction?.type === 'RESOLVED' ? 'Resolve' : 'Reject'} Complaint
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-sm text-slate-500">
                Are you sure you want to {confirmAction?.type === 'RESOLVED' ? 'resolve' : 'reject'} complaint{' '}
                <span className="font-bold text-[#0D0D12]">{confirmAction?.complaint.complaintCode || `#${confirmAction?.complaint.complaintId}`}</span>?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="bg-slate-50 px-8 py-5 border-t border-slate-100 sm:space-x-0 gap-3 rounded-b-[32px]">
            <AlertDialogCancel className="px-5 py-2.5 text-sm font-bold text-slate-500 bg-transparent border-0 shadow-none hover:bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle}
              disabled={isToggling}
              className={`px-7 py-2.5 rounded-2xl text-sm font-bold shadow-lg text-white border-0 ${
                confirmAction?.type === 'RESOLVED'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-rose-500 hover:bg-rose-600'
              }`}
            >
              {isToggling && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmAction?.type === 'RESOLVED' ? 'Resolve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Complaints;
