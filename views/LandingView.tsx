
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanRequest } from '../types';

interface LandingViewProps {
  isLoggedIn: boolean;
  onStartLoan: (loan: LoanRequest) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ isLoggedIn, onStartLoan }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50000000); // Mặc định 50 triệu
  const [term, setTerm] = useState(30); // Mặc định 30 ngày cho khoản vay lớn

  useEffect(() => {
    // Nếu thiết bị đã bị khóa, chuyển hướng ngay về trang kết quả hoặc trang khóa
    if (localStorage.getItem('device_locked') === 'true') {
      navigate('/locked');
    }
  }, [navigate]);

  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const handleApply = () => {
    const loan: LoanRequest = {
      amount,
      termDays: term,
      interestRate: 0.001, // 0.1% per day
      serviceFee: amount * 0.02 // Giảm phí dịch vụ cho khoản vay lớn
    };
    onStartLoan(loan);
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">Vay Nhanh 100%</h1>
        <p className="text-slate-500 text-sm">Hạn mức tối đa 200 Triệu</p>
      </div>

      {/* Loan Calculator Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-50 space-y-6">
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Số tiền cần vay</label>
          <div className="text-3xl font-bold text-emerald-600 mb-4">{formatVND(amount)}</div>
          <input 
            type="range"
            min="1000000"
            max="200000000"
            step="1000000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer custom-slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
            <span>1.000.000đ</span>
            <span>200.000.000đ</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Thời hạn vay</label>
          <div className="flex gap-2">
            {[7, 14, 30, 60, 90].map((t) => (
              <button 
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  term === t ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {t} ngày
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleApply}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          Đăng ký vay ngay
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span className="text-xs font-bold text-slate-700">Hạn mức tới 200tr</span>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-2 text-emerald-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <span className="text-xs font-bold text-slate-700">Tỷ lệ duyệt 100%</span>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
