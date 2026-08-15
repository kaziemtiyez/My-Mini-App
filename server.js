import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.js";
import referralRoutes from "./routes/referral.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 3000);

const ADMIN_TELEGRAM_ID =
  process.env.ADMIN_TELEGRAM_ID || "";

const WITHDRAWAL_CHAT_ID =
  process.env.WITHDRAWAL_CHAT_ID || "";

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    app: "Mini Dollar Earn",
    status: "online",
    version: "1.0.0"
  });
});

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

app.use("/api/user", userRoutes);
app.use("/api/referral", referralRoutes);

app.get("/api/admin-info", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found"
  });
});

app.get("/api/bot-token", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found"
  });
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Mini Dollar Earn running on port ${PORT}`
  );

  console.log(
    "Admin security:",
    Boolean(ADMIN_TELEGRAM_ID)
  );

  console.log(
    "Withdrawal channel configured:",
    Boolean(WITHDRAWAL_CHAT_ID)
  );
});
