
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { 
      role: 'ai', 
      text: 'Chào bạn! Để được hỗ trợ nhận tiền và tư vấn nhanh nhất, vui lòng liên hệ chuyên viên qua Telegram: https://t.me/Vaynhanh100. Bạn cần hỗ trợ gì thêm không?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const aiResponse = await getChatbotResponse([], userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Vui lòng liên hệ Telegram https://t.me/Vaynhanh100 để được hỗ trợ." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Kết nối bận, vui lòng nhắn tin trực tiếp cho chúng tôi tại: https://t.me/Vaynhanh100" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[60]">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-600 p-3 text-white flex justify-between items-center">
            <span className="font-semibold text-sm">Hỗ trợ trực tuyến</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow p-3 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text.includes('http') ? (
                    <span>
                      {m.text.split(/(https?:\/\/[^\s]+)/g).map((part, idx) => 
                        part.match(/^https?:\/\//) ? (
                          <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all font-bold">
                            {part}
                          </a>
                        ) : part
                      )}
                    </span>
                  ) : m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-2 rounded-xl text-slate-400 text-[10px] animate-pulse">Đang kết nối chuyên viên...</div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi tại đây..."
              className="flex-grow text-sm outline-none bg-slate-100 p-2 rounded-lg"
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white p-2 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
