import dotenv from "dotenv";
import {
  sendTelegramMessage
} from "../services/telegram.js";

dotenv.config();

const BOT_TOKEN =
  process.env.BOT_TOKEN;

const MINI_APP_URL =
  process.env.MINI_APP_URL ||
  "https://YOUR-DOMAIN.com";

async function telegram(method, data) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}

export async function setBotCommands() {
  return telegram(
    "setMyCommands",
    {
      commands: [
        {
          command: "start",
          description: "Open Mini App"
        },
        {
          command: "help",
          description: "Help"
        }
      ]
    }
  );
}

export async function sendMiniAppMenu(
  chatId
) {
  return telegram(
    "sendMessage",
    {
      chat_id: chatId,
      text:
        "💰 <b>Mini Dollar Earn</b>\n\nOpen the Mini App and start earning.",
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💰 OPEN MINI APP",
              web_app: {
                url: MINI_APP_URL
              }
            }
          ]
        ]
      }
    }
  );
}

export async function startBotPolling() {
  let offset = 0;

  while (true) {
    try {
      const result =
        await telegram(
          "getUpdates",
          {
            offset,
            timeout: 25
          }
        );

      if (!result.ok) {
        await new Promise(
          resolve =>
            setTimeout(resolve, 5000)
        );

        continue;
      }

      for (const update of result.result) {
        offset = update.update_id + 1;

        const message =
          update.message;

        if (!message?.chat?.id) {
          continue;
        }

        const text =
          message.text || "";

        if (text.startsWith("/start")) {
          await sendMiniAppMenu(
            message.chat.id
          );
        }

        if (text === "/help") {
          await sendTelegramMessage(
            message.chat.id,
            "💰 Mini Dollar Earn\n\nWatch verified ads, invite friends and request withdrawals after reaching $10."
          );
        }
      }

    } catch (error) {
      console.error(
        "Bot polling error:",
        error
      );

      await new Promise(
        resolve =>
          setTimeout(resolve, 5000)
      );
    }
  }
}
