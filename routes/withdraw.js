import express from "express";

import { validateTelegramInitData } from "../services/telegram.js";
import {
  createWithdrawal,
  getUserWithdrawals
} from "../services/withdrawal.js";
import { findUser } from "../services/user.js";
import { sendWithdrawalNotification } from "../services/notification.js";

const router = express.Router();

function authenticate(req) {
  return validateTelegramInitData(
    req.headers["x-telegram-init-data"]
  );
}

router.post("/", async (req, res) => {
  try {
    const telegramUser = authenticate(req);

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const {
      amount,
      method,
      destination
    } = req.body;

    const withdrawal = createWithdrawal({
      telegramId: telegramUser.id,
      amount,
      method,
      destination
    });

    const user = findUser(telegramUser.id);

    await sendWithdrawalNotification(
      withdrawal,
      user
    );

    return res.json({
      success: true,
      message: "Withdrawal request submitted",
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        method: withdrawal.method,
        status: withdrawal.status,
        created_at: withdrawal.created_at
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", (req, res) => {
  const telegramUser = authenticate(req);

  if (!telegramUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  return res.json({
    success: true,
    withdrawals: getUserWithdrawals(
      telegramUser.id
    )
  });
});

export default router;
