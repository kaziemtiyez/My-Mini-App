import express from "express";
import crypto from "crypto";

import { loadDatabase, saveDatabase } from "../database/database.js";
import { rewards } from "../config/rewards.js";

const router = express.Router();

router.get("/monetag", (req, res) => {
  try {
    const {
      ymid,
      telegram_id,
      event,
      reward_event_type
    } = req.query;

    if (!ymid || !telegram_id) {
      return res.status(400).send("missing");
    }

    // Only valued monetized events receive reward.
    if (
      reward_event_type &&
      reward_event_type !== "valued"
    ) {
      return res.send("ignored");
    }

    const db = loadDatabase();

    const user = db.users.find(
      u =>
        u.telegram_id ===
        String(telegram_id)
    );

    if (!user) {
      return res.status(404).send("user_not_found");
    }

    // Prevent duplicate postback reward.
    const duplicate =
      db.adViews.find(
        v =>
          v.network === "monetag" &&
          v.session_id === String(ymid) &&
          v.status === "postback_rewarded"
      );

    if (duplicate) {
      return res.send("duplicate");
    }

    user.balance =
      Number(user.balance || 0) +
      Number(rewards.monetag.reward);

    db.adViews.push({
      id: crypto.randomUUID(),
      telegram_id: String(telegram_id),
      network: "monetag",
      reward: rewards.monetag.reward,
      session_id: String(ymid),
      event: event || "impression",
      status: "postback_rewarded",
      created_at: Date.now()
    });

    saveDatabase(db);

    return res.send("ok");

  } catch (error) {
    console.error(
      "Monetag postback:",
      error
    );

    return res.status(500).send("error");
  }
});

export default router;
