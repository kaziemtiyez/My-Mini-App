import dotenv from "dotenv";
import { sendTelegramMessage } from "./telegram.js";

dotenv.config();

const WITHDRAWAL_CHAT_ID =
  process.env.WITHDRAWAL_CHAT_ID;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendWithdrawalNotification(
  withdrawal,
  user
) {
  if (!WITHDRAWAL_CHAT_ID) {
    throw new Error(
      "WITHDRAWAL_CHAT_ID is not configured"
    );
  }

  const method =
    withdrawal.method === "binance_trc20"
      ? "Binance TRC20"
      : "PayPal";

  const message = `
<b>💸 NEW WITHDRAWAL REQUEST</b>

<b>ID:</b> <code>${escapeHtml(withdrawal.id)}</code>

<b>User ID:</b> <code>${escapeHtml(user.telegram_id)}</code>
<b>Username:</b> @${escapeHtml(user.username || "N/A")}

<b>Amount:</b> $${Number(withdrawal.amount).toFixed(2)}
<b>Method:</b> ${escapeHtml(method)}

<b>Destination:</b>
<code>${escapeHtml(withdrawal.destination)}</code>

<b>Status:</b> ⏳ PENDING

Please review this request from the Admin Panel.
`;

  return sendTelegramMessage(
    WITHDRAWAL_CHAT_ID,
    message
  );
}

export async function sendUserNotification(
  telegramId,
  text
) {
  return sendTelegramMessage(
    telegramId,
    text
  );
}
