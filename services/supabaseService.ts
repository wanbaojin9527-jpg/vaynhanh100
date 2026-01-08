
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';
import { UserProfile, LoanRequest, LoanRecord } from '../types';

// Lấy thông tin từ môi trường hoặc để trống nếu chưa có
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Kiểm tra xem URL có hợp lệ không (bắt đầu bằng http) để tránh lỗi crash lúc khởi tạo
const isValidConfig = SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 0;

export const supabase = isValidConfig 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

/**
 * Kiểm tra xem số điện thoại hoặc số tài khoản đã tồn tại chưa
 */
export const checkExistingApplication = async (phone: string, bankAccount?: string) => {
  if (!supabase) {
    console.warn("Supabase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.");
    return false;
  }

  try {
    let query = supabase.from('applications').select('phone, bank_account');
    
    if (bankAccount) {
      query = query.or(`phone.eq.${phone},bank_account.eq.${bankAccount}`);
    } else {
      query = query.eq('phone', phone);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Lỗi kiểm tra trùng lặp trên Supabase:", error);
      return false;
    }
    return data && data.length > 0;
  } catch (err) {
    console.error("Lỗi ngoại lệ Supabase:", err);
    return false;
  }
};

/**
 * Lưu toàn bộ hồ sơ vào Supabase
 */
export const saveApplication = async (profile: UserProfile, loan: LoanRequest, score: number, status: string) => {
  if (!supabase) {
    console.warn("Supabase chưa được cấu hình. Đang bỏ qua bước lưu Cloud.");
    return null;
  }

  const { data, error } = await supabase.from('applications').insert([
    {
      phone: profile.phone,
      full_name: profile.fullName,
      age: profile.age,
      job: profile.job,
      income: profile.monthlyIncome,
      location: profile.location,
      marital_status: profile.maritalStatus,
      bank_name: profile.bankName,
      bank_account: profile.bankAccountNumber,
      loan_amount: loan.amount,
      loan_term: loan.termDays,
      status: status,
      score: score,
      id_front: profile.idFront,
      id_back: profile.idBack,
      portrait: profile.portrait,
      created_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error("Lỗi lưu hồ sơ vào Supabase:", error);
    throw error;
  }
  return data;
};

/**
 * Lấy lịch sử vay từ Supabase dựa trên số điện thoại
 */
export const getLoanHistoryByPhone = async (phone: string): Promise<LoanRecord[]> => {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false });

    if (error) return [];
    
    return data.map(item => ({
      id: `VAY-${item.id.toString().slice(0, 5).toUpperCase()}`,
      amount: item.loan_amount,
      status: item.status as any,
      date: new Date(item.created_at).toLocaleDateString('vi-VN'),
      score: item.score
    }));
  } catch (err) {
    return [];
  }
};
