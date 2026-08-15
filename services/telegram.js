import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

export function validateTelegramInitData(initData) {
  if (!initData || !BOT_TOKEN) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) return null;

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) return null;

  const authDate = Number(params.get("auth_date"));

  if (!authDate) return null;

  const maxAge = 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  if (now - authDate > maxAge) return null;

  let user = null;

  try {
    user = JSON.parse(params.get("user") || "null");
  } catch {
    return null;
  }

  return user;
}

export async function sendTelegramMessage(chatId, text) {
  if (!BOT_TOKEN || !chatId) {
    throw new Error("Telegram configuration missing");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      })
    }
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description || "Telegram API error");
  }

  return result;
}
