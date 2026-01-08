
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradeScoreView: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      title: 'Gói Xác Minh Hồ Sơ',
      description: 'Xác minh CCCD/CMND & Khuôn mặt bằng công nghệ AI sinh trắc học.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      status: 'Ưu tiên cao',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      title: 'Gói Xác thực & Bảo hiểm',
      description: 'Tham gia gói bảo hiểm khoản vay để đảm bảo an toàn tài chính và tăng điểm uy tín.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      status: 'Khuyên dùng',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 3,
      title: 'Xác thực khả năng chi trả',
      description: 'Liên kết tài khoản ngân hàng hoặc sao kê lương để chứng minh thu nhập ổn định.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      status: 'Nâng điểm nhanh',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  const handleSelectOption = (title: string) => {
    // Chuyển hướng sang Telegram để xử lý nâng cấp thật
    window.open('https://t.me/Vaynhanh100', '_blank');
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-8 duration-500 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Nâng Cấp Điểm Tín Dụng</h2>
      </div>

      <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Điểm hiện tại của bạn</p>
            <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black italic">80</span>
                <span className="text-emerald-200 font-medium">/ 100</span>
            </div>
            <p className="mt-4 text-sm text-emerald-50 leading-relaxed">
                Cần thêm ít nhất <span className="font-bold underline">10 điểm</span> để đạt mức 90+ (Mức độ tin cậy cao) và được giải ngân ngay lập tức.
            </p>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500 rounded-full opacity-50 blur-2xl"></div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Lựa chọn các gói hỗ trợ</h3>
        
        {options.map((opt) => (
            <button 
                key={opt.id}
                onClick={() => handleSelectOption(opt.title)}
                className="w-full text-left bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex gap-4 items-start"
            >
                <div className={`p-3 rounded-2xl ${opt.color} group-hover:scale-110 transition-transform`}>
                    {opt.icon}
                </div>
                <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-800 text-sm">{opt.title}</h4>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full">{opt.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
                </div>
            </button>
        ))}
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
        <div className="text-amber-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        </div>
        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            Lưu ý: Sau khi chọn gói, bạn sẽ được kết nối với Chuyên viên thẩm định qua Telegram để cung cấp chứng từ bổ sung.
        </p>
      </div>

      <button 
        onClick={() => window.open('https://t.me/Vaynhanh100', '_blank')}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
      >
        Liên hệ hỗ trợ nâng cấp ngay
      </button>
    </div>
  );
};

export default UpgradeScoreView;
