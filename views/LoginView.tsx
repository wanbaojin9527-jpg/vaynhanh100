
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExistingApplication } from '../services/supabaseService';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (p: string) => {
    const vnPhoneRegex = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b$/;
    return vnPhoneRegex.test(p);
  };

  const handleLogin = async () => {
    setError('');
    if (!validatePhone(phone)) {
      return setError('Số điện thoại không đúng định dạng Việt Nam');
    }
    
    setLoading(true);
    try {
      // Kiểm tra trùng lặp trên DB
      const exists = await checkExistingApplication(phone);
      if (exists) {
        setLoading(false);
        setError('Số điện thoại này đã có hồ sơ trên hệ thống. Vui lòng không đăng ký lại.');
        // Khóa thiết bị luôn nếu phát hiện trùng trên DB
        localStorage.setItem('device_locked', 'true');
        return;
      }

      localStorage.setItem('user_phone', phone);
      setLoading(false);
      onLogin();
      navigate('/profile');
    } catch (err) {
      setLoading(false);
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right-8 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Chào mừng bạn!</h2>
        <p className="text-slate-500 text-sm">Nhập số điện thoại để bắt đầu hồ sơ</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Số điện thoại</label>
          <div className={`flex items-center gap-2 border-b-2 ${error ? 'border-red-500' : 'border-slate-100 focus-within:border-emerald-500'} transition-colors py-2`}>
            <span className="text-slate-400 font-medium">+84</span>
            <input 
              type="tel"
              placeholder="09xx xxx xxx"
              value={phone}
              onChange={(e) => {
                setError('');
                setPhone(e.target.value.replace(/\D/g, ''));
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-transparent outline-none text-lg font-semibold"
              autoFocus
              maxLength={10}
            />
          </div>
          {error && <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>}
        </div>
        
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Bắt đầu ngay'}
        </button>
      </div>

      <div className="bg-emerald-50 p-4 rounded-2xl flex items-start gap-3 border border-emerald-100">
        <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-[11px] text-emerald-700 leading-tight">
          Hệ thống sẽ kiểm tra trùng lặp hồ sơ trên toàn mạng lưới. Mỗi cá nhân chỉ được đăng ký 01 tài khoản.
        </div>
      </div>
    </div>
  );
};

export default LoginView;
