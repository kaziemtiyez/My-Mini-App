import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/*
|--------------------------------------------------------------------------
| BASIC CONFIGURATION
|--------------------------------------------------------------------------
*/

const PORT = Number(process.env.PORT || 3000);

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID || "";
const WITHDRAWAL_CHAT_ID = process.env.WITHDRAWAL_CHAT_ID || "";

/*
|--------------------------------------------------------------------------
| SECURITY CHECK
|--------------------------------------------------------------------------
*/

if (!BOT_TOKEN) {
  console.warn("WARNING: BOT_TOKEN is not configured.");
}

if (!ADMIN_TELEGRAM_ID) {
  console.warn("WARNING: ADMIN_TELEGRAM_ID is not configured.");
}

if (!WITHDRAWAL_CHAT_ID) {
  console.warn("WARNING: WITHDRAWAL_CHAT_ID is not configured.");
}

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| STATIC MINI APP
|--------------------------------------------------------------------------
*/

app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| BASIC HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    app: "Telegram Mini Income Bot",
    status: "online",
    version: "1.0.0"
  });
});

/*
|--------------------------------------------------------------------------
| PUBLIC CONFIG
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Never return:
| - BOT_TOKEN
| - ADMIN_TELEGRAM_ID
| - WITHDRAWAL_CHAT_ID
| - private API keys
|
| Only safe frontend settings belong here.
|--------------------------------------------------------------------------
*/

app.get("/api/config", (req, res) => {
  res.json({
    success: true,
    config: {
      currency: "USD",
      minimumWithdrawal: 10,
      adsGramDailyLimit: 15,
      monetagDailyLimit: 10,
      adCooldownSeconds: 3
    }
  });
});

/*
|--------------------------------------------------------------------------
| SECURITY: NEVER EXPOSE ADMIN INFORMATION
|--------------------------------------------------------------------------
*/

app.get("/api/admin-info", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Not found"
  });
});

/*
|--------------------------------------------------------------------------
| SECURITY: NEVER EXPOSE BOT TOKEN
|--------------------------------------------------------------------------
*/

app.get("/api/bot-token", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Not found"
  });
});

/*
|--------------------------------------------------------------------------
| ROOT FALLBACK
|--------------------------------------------------------------------------
*/

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log(" Telegram Mini Income Bot");
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log("Admin secrets loaded:", Boolean(ADMIN_TELEGRAM_ID));
  console.log("Bot token loaded:", Boolean(BOT_TOKEN));
  console.log("Withdrawal channel configured:", Boolean(WITHDRAWAL_CHAT_ID));
  console.log("======================================");
});
