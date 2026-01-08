
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanRecord, CreditScoreResult } from '../types';

interface ResultViewProps {
  history: LoanRecord[];
}

const ResultView: React.FC<ResultViewProps> = ({ history }) => {
  const navigate = useNavigate();
  const lastLoan = history[0];
  const lastResult: CreditScoreResult = JSON.parse(localStorage.getItem('last_ai_result') || '{}');

  // Điểm dưới 90 là thất bại
  const isApproved = lastLoan?.status === 'approved' && lastResult.credit_score >= 90;

  return (
    <div className="p-6 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        {isApproved ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Chúc mừng! Bạn đã được duyệt</h2>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Phê duyệt thất bại</h2>
          </>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-50 space-y-6">
        <div className="flex flex-col items-center border-b border-slate-50 pb-6">
            <span className="text-xs text-slate-400 font-bold uppercase mb-1">Điểm tín dụng</span>
            {/* Điểm dưới 90 dùng màu đỏ/cam thay vì xanh */}
            <div className={`text-5xl font-black ${lastResult.credit_score >= 90 ? 'text-emerald-500' : 'text-orange-500'}`}>{lastResult.credit_score}</div>
            <span className="text-[10px] text-slate-400 mt-1">Hệ thống đánh giá: <span className="text-slate-700 font-bold uppercase">{lastResult.risk_level} Risk</span></span>
        </div>

        <div className="space-y-4">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Trạng thái:</span>
                <span className={`font-bold uppercase ${isApproved ? 'text-emerald-600' : 'text-red-600'}`}>{isApproved ? 'Đã duyệt' : 'Từ chối'}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Mã giao dịch:</span>
                <span className="font-mono font-bold text-slate-700">#{lastLoan?.id}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái hồ sơ:</span>
                <p className="text-xs text-slate-600 italic">"{lastResult.reason}"</p>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Nút Nâng Cấp Điểm Tín Dụng luôn hiển thị khi điểm thấp để khuyến khích nâng cấp */}
        <button 
          className={`w-full ${isApproved ? 'bg-emerald-600' : 'bg-emerald-500'} text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform`} 
          onClick={() => navigate('/upgrade-score')}
        >
          Nâng Cấp Điểm Tín Dụng
        </button>
        
        {!isApproved && (
            <button className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-sm" onClick={() => navigate('/')}>
                Quay lại trang chủ
            </button>
        )}
        <button onClick={() => navigate('/history')} className="w-full text-slate-400 text-[11px] font-medium">Xem lịch sử khoản vay</button>
      </div>
    </div>
  );
};

export default ResultView;
