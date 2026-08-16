import express from "express";

import { validateTelegramInitData } from "../services/telegram.js";
import { isAdmin } from "../config/admin.js";

import {
  getPendingWithdrawals,
  updateWithdrawal
} from "../services/withdrawal.js";

import { findUser } from "../services/user.js";
import { sendUserNotification } from "../services/notification.js";

const router = express.Router();

function getAdmin(req) {
  const user = validateTelegramInitData(
    req.headers["x-telegram-init-data"]
  );

  if (!user || !isAdmin(user.id)) {
    return null;
  }

  return user;
}

router.get("/withdrawals", (req, res) => {
  if (!getAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  return res.json({
    success: true,
    withdrawals: getPendingWithdrawals()
  });
});

router.post(
  "/withdrawals/:id/approve",
  async (req, res) => {
    try {
      const admin = getAdmin(req);

      if (!admin) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      const withdrawal = updateWithdrawal(
        req.params.id,
        "paid",
        "Approved by admin"
      );

      await sendUserNotification(
        withdrawal.telegram_id,
        `✅ Withdrawal Approved\n\nAmount: $${Number(
          withdrawal.amount
        ).toFixed(2)}\nMethod: ${
          withdrawal.method
        }\n\nYour withdrawal has been marked as PAID.`
      );

      return res.json({
        success: true,
        withdrawal
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

router.post(
  "/withdrawals/:id/reject",
  async (req, res) => {
    try {
      const admin = getAdmin(req);

      if (!admin) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      const withdrawal = updateWithdrawal(
        req.params.id,
        "rejected",
        req.body?.note || "Rejected by admin"
      );

      await sendUserNotification(
        withdrawal.telegram_id,
        `❌ Withdrawal Rejected\n\nAmount: $${Number(
          withdrawal.amount
        ).toFixed(2)}\n\nThe amount has been returned to your balance.`
      );

      return res.json({
        success: true,
        withdrawal
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

export default router;
