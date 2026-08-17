import express from "express";

import {
  validateTelegramInitData
} from "../services/telegram.js";

import {
  claimAdReward
} from "../services/ad-reward.js";

const router = express.Router();

router.post("/claim", (req, res) => {

  try {

    const telegramUser =
      validateTelegramInitData(
        req.headers["x-telegram-init-data"]
      );

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const {
      network,
      verified
    } = req.body;

    if (verified !== true) {
      return res.status(400).json({
        success: false,
        message:
          "Ad completion was not verified"
      });
    }

    const result =
      claimAdReward({
        telegramId: telegramUser.id,
        network,
        verified
      });

    return res.json({
      success: true,
      reward: result.reward,
      balance: result.balance,
      sessionId: result.sessionId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

});

export default router;
