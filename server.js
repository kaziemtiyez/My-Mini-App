import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.js";
import referralRoutes from "./routes/referral.js";
import withdrawRoutes from "./routes/withdraw.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(
  path.join(__dirname, "public")
));

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
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/admin", adminRoutes);

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
    path.join(__dirname, "public", "index.html")
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
  console.log("================================");
  console.log(" Mini Dollar Earn");
  console.log(" Server is running");
  console.log("================================");
  console.log(`Port: ${PORT}`);
  console.log(
    "Bot configured:",
    Boolean(process.env.BOT_TOKEN)
  );
  console.log(
    "Admin configured:",
    Boolean(process.env.ADMIN_TELEGRAM_ID)
  );
  console.log(
    "Withdrawal channel configured:",
    Boolean(process.env.WITHDRAWAL_CHAT_ID)
  );
});
