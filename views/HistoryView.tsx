
import React from 'react';
import { LoanRecord } from '../types';

interface HistoryViewProps {
  history: LoanRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Lịch sử vay</h2>
        <p className="text-slate-500 text-xs">Quản lý các khoản vay của bạn</p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
          <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p className="text-sm">Bạn chưa có lịch sử vay nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div key={h.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center animate-in slide-in-from-left-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{formatVND(h.amount)}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{h.id}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    {h.date}
                    <span className="ml-2 bg-emerald-50 text-emerald-600 px-1 rounded font-bold">Score: {h.score}</span>
                </div>
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                    h.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                    h.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-600'
                }`}>
                    {h.status === 'approved' ? 'Đã duyệt' : h.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
