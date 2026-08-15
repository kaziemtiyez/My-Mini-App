import express from "express";

import {
  validateTelegramInitData
} from "../services/telegram.js";

import {
  getLeaderboard,
  createReferralCode
} from "../services/referral.js";

import { findUser } from "../services/user.js";

const router = express.Router();

function authenticate(req) {
  return validateTelegramInitData(
    req.headers["x-telegram-init-data"]
  );
}

router.get("/info", (req, res) => {
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

    referralCode: createReferralCode(
      telegramUser.id
    ),

    referralCount: Number(
      user.referral_count || 0
    ),

    referralBalance: Number(
      user.referral_balance || 0
    )
  });
});

router.get("/leaderboard", (req, res) => {
  return res.json({
    success: true,
    leaderboard: getLeaderboard(10)
  });
});

export default router;
