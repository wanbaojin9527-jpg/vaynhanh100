
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface IdentityVerificationViewProps {
  user: UserProfile;
  onSave: (u: UserProfile) => void;
}

const IdentityVerificationView: React.FC<IdentityVerificationViewProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const [idFront, setIdFront] = useState<string | null>(user.idFront || null);
  const [idBack, setIdBack] = useState<string | null>(user.idBack || null);
  const [portrait, setPortrait] = useState<string | null>(user.portrait || null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePortrait = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPortrait(dataUrl);
        stopCamera();
      }
    }
  };

  const handleContinue = () => {
    if (!idFront || !idBack || !portrait) {
      return alert("Vui lòng cung cấp đủ ảnh CCCD (2 mặt) và ảnh chân dung đúng khuôn mẫu.");
    }
    onSave({ ...user, idFront, idBack, portrait });
    navigate('/loan-review');
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-8 duration-300 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Xác thực định danh</h2>
        <p className="text-slate-500 text-xs">Yêu cầu ảnh chụp rõ nét, không mất góc, không chói sáng</p>
      </div>

      {/* ID Cards Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Căn cước công dân (CCCD)</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Front */}
          <div className="space-y-2">
            <p className="text-[10px] text-center font-bold text-slate-500 uppercase">Mặt trước mẫu</p>
            <div 
              className="aspect-[3/2] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-300 transition-colors cursor-pointer"
              onClick={() => document.getElementById('front-upload')?.click()}
            >
              {idFront ? (
                <img src={idFront} alt="Mặt trước" className="w-full h-full object-cover" />
              ) : (
                <>
                   {/* Khung hướng dẫn CCCD */}
                  <div className="absolute inset-2 border-2 border-emerald-500/30 rounded-lg pointer-events-none border-dashed"></div>
                  <div className="text-center p-4 z-10">
                    <svg className="w-8 h-8 text-slate-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span className="text-[10px] font-bold text-slate-400">Tải mặt trước</span>
                  </div>
                </>
              )}
              <input 
                id="front-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, setIdFront)}
              />
            </div>
          </div>

          {/* Back */}
          <div className="space-y-2">
            <p className="text-[10px] text-center font-bold text-slate-500 uppercase">Mặt sau mẫu</p>
            <div 
              className="aspect-[3/2] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-300 transition-colors cursor-pointer"
              onClick={() => document.getElementById('back-upload')?.click()}
            >
              {idBack ? (
                <img src={idBack} alt="Mặt sau" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-2 border-2 border-emerald-500/30 rounded-lg pointer-events-none border-dashed"></div>
                  <div className="text-center p-4 z-10">
                    <svg className="w-8 h-8 text-slate-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span className="text-[10px] font-bold text-slate-400">Tải mặt sau</span>
                  </div>
                </>
              )}
              <input 
                id="back-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, setIdBack)}
              />
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl flex gap-2 items-start">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <p className="text-[9px] text-slate-500 leading-tight">Mẹo: Đặt thẻ lên mặt phẳng tối màu, căn chỉnh thẻ vừa khít với khung hình để đạt kết quả tốt nhất.</p>
        </div>
      </div>

      {/* Portrait Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Xác thực khuôn mặt</h3>
        
        {isCameraActive ? (
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl h-80">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {/* Khung Oval hướng dẫn chụp chân dung */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 border-2 border-emerald-500/50 rounded-[100px] shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]"></div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
              <button onClick={stopCamera} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold">Hủy</button>
              <button onClick={capturePortrait} className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">Chụp ngay</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-44 h-44 rounded-full border-4 border-emerald-50 bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner relative group cursor-pointer"
              onClick={startCamera}
            >
              {portrait ? (
                <img src={portrait} alt="Chân dung" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Mở Camera Chụp</span>
                </div>
              )}
              {portrait && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-[10px] font-bold">Chụp lại</span>
                </div>
              )}
            </div>
            {!portrait && (
              <button 
                onClick={() => document.getElementById('portrait-upload')?.click()}
                className="text-xs text-emerald-600 font-bold underline"
              >
                Hoặc tải lên từ thư viện
              </button>
            )}
            <input 
              id="portrait-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileUpload(e, setPortrait)}
            />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="pt-4">
        <button 
          onClick={handleContinue}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Xác nhận & Tiếp tục
        </button>
      </div>
      
      <p className="text-[10px] text-center text-slate-400 leading-relaxed px-4">
        Hệ thống AI sẽ đối chiếu khuôn mặt với CCCD để đảm bảo tính xác thực. Dữ liệu của bạn được bảo mật tuyệt đối.
      </p>
    </div>
  );
};

export default IdentityVerificationView;
