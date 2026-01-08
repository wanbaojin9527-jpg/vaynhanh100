
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LockedView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">Thiết bị đã được <br/><span className="text-emerald-600">đăng ký hồ sơ</span></h2>
        <p className="text-slate-500 text-sm leading-relaxed px-4">
          Hệ thống ghi nhận thiết bị này đã thực hiện đăng ký vay thành công. Để bảo mật và tránh trùng lặp dữ liệu, mỗi thiết bị chỉ được phép gửi 01 hồ sơ duy nhất.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 w-full text-left space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hướng dẫn tiếp theo:</h4>
        <ul className="space-y-2">
            <li className="flex gap-2 items-start text-xs text-slate-600">
                <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex-shrink-0 flex items-center justify-center text-[8px] mt-0.5">1</div>
                <span>Truy cập mục <b>Lịch sử</b> để xem kết quả.</span>
            </li>
            <li className="flex gap-2 items-start text-xs text-slate-600">
                <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex-shrink-0 flex items-center justify-center text-[8px] mt-0.5">2</div>
                <span>Liên hệ chuyên viên qua Telegram để nhận giải ngân.</span>
            </li>
        </ul>
      </div>

      <div className="w-full space-y-3 pt-4">
        <button 
          onClick={() => navigate('/result')}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Xem Kết Quả Vay
        </button>
        <button 
          onClick={() => window.open('https://t.me/Vaynhanh100', '_blank')}
          className="w-full bg-white text-emerald-600 border-2 border-emerald-600 py-3 rounded-2xl font-bold text-sm"
        >
          Kết nối Telegram hỗ trợ
        </button>
      </div>
      
      <p className="text-[10px] text-slate-400 font-medium">Mã thiết bị: {navigator.userAgent.length}-{Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
    </div>
  );
};

export default LockedView;
