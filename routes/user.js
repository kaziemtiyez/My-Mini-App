import express from "express";

import {
  validateTelegramInitData
} from "../services/telegram.js";

import {
  getOrCreateUser,
  findUser,
  sanitizeUser
} from "../services/user.js";

const router = express.Router();

function authenticate(req) {
  const initData =
    req.headers["x-telegram-init-data"];

  return validateTelegramInitData(initData);
}

router.post("/login", (req, res) => {
  try {
    const telegramUser = authenticate(req);

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Telegram authentication"
      });
    }

    const referralCode =
      req.body?.referralCode || null;

    const user = getOrCreateUser(
      telegramUser,
      referralCode
    );

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

router.get("/me", (req, res) => {
  try {
    const telegramUser = authenticate(req);

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = findUser(telegramUser.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user)
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to load profile"
    });
  }
});

export default router;
