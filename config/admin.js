import dotenv from "dotenv";

dotenv.config();

export const adminConfig = {
  adminTelegramId:
    process.env.ADMIN_TELEGRAM_ID || "",

  withdrawalChatId:
    process.env.WITHDRAWAL_CHAT_ID || ""
};

export function isAdmin(telegramId) {
  return (
    Boolean(adminConfig.adminTelegramId) &&
    String(telegramId) ===
      String(adminConfig.adminTelegramId)
  );
}
