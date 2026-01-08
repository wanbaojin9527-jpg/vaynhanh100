
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { checkExistingApplication } from '../services/supabaseService';

interface ProfileViewProps {
  user: UserProfile | null;
  onSave: (p: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UserProfile>(user || {
    fullName: '',
    phone: localStorage.getItem('user_phone') || '',
    age: 25,
    job: 'Nhân viên văn phòng',
    monthlyIncome: 15000000,
    location: 'Hà Nội',
    maritalStatus: 'Độc thân',
    bankName: '',
    bankAccountNumber: ''
  });

  const handleSave = async () => {
    if (!form.fullName) return alert('Vui lòng nhập họ tên');
    if (!form.bankName) return alert('Vui lòng nhập tên ngân hàng');
    if (!form.bankAccountNumber) return alert('Vui lòng nhập số tài khoản');
    
    setLoading(true);
    try {
      // Kiểm tra trùng lặp SĐT hoặc STK ngân hàng
      const isDuplicate = await checkExistingApplication(form.phone, form.bankAccountNumber);
      if (isDuplicate) {
        setLoading(false);
        alert('Số điện thoại hoặc Số tài khoản ngân hàng này đã được đăng ký hồ sơ trên hệ thống. Bạn không thể tạo thêm hồ sơ mới.');
        localStorage.setItem('device_locked', 'true');
        navigate('/locked');
        return;
      }

      onSave(form);
      setLoading(false);
      navigate('/identity-verify');
    } catch (error) {
      setLoading(false);
      alert('Lỗi máy chủ khi kiểm tra hồ sơ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-bottom-8 duration-300 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
        <p className="text-slate-500 text-xs">Thông tin phải chính xác 100% để được giải ngân</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Họ và tên (Chủ tài khoản)</label>
          <input 
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({...form, fullName: e.target.value.toUpperCase()})}
            className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700"
            placeholder="NGUYỄN VĂN A"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngân hàng</label>
            <input 
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({...form, bankName: e.target.value})}
              className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-600"
              placeholder="VD: MB BANK"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tài khoản</label>
            <input 
              type="text"
              value={form.bankAccountNumber}
              onChange={(e) => setForm({...form, bankAccountNumber: e.target.value.replace(/\D/g, '')})}
              className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
              placeholder="Nhập số tài khoản"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tuổi</label>
            <input 
              type="number"
              value={form.age}
              onChange={(e) => setForm({...form, age: Number(e.target.value)})}
              className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Thu nhập</label>
            <input 
              type="number"
              value={form.monthlyIncome}
              onChange={(e) => setForm({...form, monthlyIncome: Number(e.target.value)})}
              className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nghề nghiệp</label>
          <input 
            type="text"
            value={form.job}
            onChange={(e) => setForm({...form, job: e.target.value})}
            className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Tiếp tục: Xác thực định danh'}
      </button>
    </div>
  );
};

export default ProfileView;
