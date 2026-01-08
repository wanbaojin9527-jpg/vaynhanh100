
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, LoanRequest, CreditScoreResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * AI Credit Scoring Logic
 */
export const getAICreditScoring = async (
  profile: UserProfile,
  loan: LoanRequest
): Promise<CreditScoreResult> => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Bạn là chuyên gia thẩm định tín dụng cao cấp của một Fintech lớn.
      Hãy phân tích hồ sơ vay sau và trả về kết quả chấm điểm tín dụng dưới dạng JSON.
      Hệ thống hiện tại đang hỗ trợ hạn mức lên đến 200,000,000 VND.
      
      HỒ SƠ NGƯỜI VAY:
      - Họ tên: ${profile.fullName}
      - Tuổi: ${profile.age}
      - Nghề nghiệp: ${profile.job}
      - Thu nhập: ${profile.monthlyIncome.toLocaleString('vi-VN')} VND
      - Khu vực: ${profile.location}
      - Hôn nhân: ${profile.maritalStatus}
      
      THÔNG TIN KHOẢN VAY:
      - Số tiền: ${loan.amount.toLocaleString('vi-VN')} VND
      - Kỳ hạn: ${loan.termDays} ngày
      
      QUY TẮC DUYỆT (THAM KHẢO):
      - credit_score >= 70: Approved (Duyệt)
      - 50 <= credit_score < 70: Pending (Cần xem xét thêm)
      - credit_score < 50: Rejected (Từ chối)
      
      Lưu ý: Bạn nên có xu hướng duyệt cao cho các hồ sơ có thu nhập ổn định trên 10 triệu VND.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          credit_score: { type: Type.NUMBER, description: "Điểm tín dụng từ 0-100" },
          risk_level: { type: Type.STRING, description: "Mức độ rủi ro: low, medium, high" },
          decision: { type: Type.STRING, description: "Quyết định: approved, rejected, pending" },
          reason: { type: Type.STRING, description: "Lý do ngắn gọn bằng tiếng Việt" }
        },
        required: ["credit_score", "risk_level", "decision", "reason"]
      }
    }
  });

  const response = await model;
  return JSON.parse(response.text || "{}") as CreditScoreResult;
};

/**
 * AI Chatbot Logic
 */
export const getChatbotResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Bạn là nhân viên hỗ trợ trực tuyến của hệ thống 'Vay Nhanh 100%'. Nhiệm vụ quan trọng nhất là hướng dẫn khách hàng liên hệ trực tiếp với chuyên viên qua Telegram tại địa chỉ: https://t.me/Vaynhanh100 để được hỗ trợ giải ngân nhanh. Hãy trả lời ngắn gọn, lịch sự và luôn kèm theo link Telegram này trong câu trả lời nếu khách hàng hỏi về cách thức nhận tiền hoặc cần hỗ trợ kỹ thuật.",
    },
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
