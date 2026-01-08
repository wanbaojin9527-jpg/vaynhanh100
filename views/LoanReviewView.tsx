
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanRequest } from '../types';

interface LoanReviewViewProps {
  loan: LoanRequest;
}

const LoanReviewView: React.FC<LoanReviewViewProps> = ({ loan }) => {
  const navigate = useNavigate();
  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const interest = loan.amount * loan.interestRate * loan.termDays;
  const total = loan.amount + interest + loan.serviceFee;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Xác nhận khoản vay</h2>
        <p className="text-slate-500 text-xs">Vui lòng kiểm tra lại thông tin trước khi giải ngân</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-50 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-sm text-slate-400">Số tiền vay</span>
          <span className="font-bold text-emerald-600 text-lg">{formatVND(loan.amount)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-sm text-slate-400">Kỳ hạn</span>
          <span className="font-bold text-slate-700">{loan.termDays} ngày</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-sm text-slate-400">Lãi suất (0.1%/ngày)</span>
          <span className="font-medium text-slate-700">{formatVND(interest)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-sm text-slate-400">Phí dịch vụ (2%)</span>
          <span className="font-medium text-slate-700">{formatVND(loan.serviceFee)}</span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-base font-bold text-slate-800">Tổng thanh toán dự kiến</span>
          <span className="font-black text-xl text-emerald-600">{formatVND(total)}</span>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-2xl flex gap-3 border border-emerald-100">
        <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          Chúng tôi đã sẵn sàng phê duyệt hạn mức <strong>200 triệu</strong> của bạn ngay lập tức.
        </p>
      </div>

      <button 
        onClick={() => navigate('/scoring')}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 group active:scale-95 transition-all"
      >
        <span>Duyệt ngay & Nhận tiền</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>
    </div>
  );
};

export default LoanReviewView;
