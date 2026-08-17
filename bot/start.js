import dotenv from "dotenv";
import {
  startBotPolling,
  setBotCommands
} from "./bot.js";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  console.error(
    "BOT_TOKEN is missing."
  );

  process.exit(1);
}

await setBotCommands();

console.log(
  "Telegram bot started."
);

await startBotPolling();
