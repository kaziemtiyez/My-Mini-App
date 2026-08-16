import crypto from "crypto";

import { loadDatabase, saveDatabase } from "../database/database.js";

const SETTINGS = {
  adsgram: {
    reward: 0.20,
    dailyLimit: 15,
    cooldown: 3
  },

  monetag: {
    reward: 0.20,
    dailyLimit: 10,
    cooldown: 3
  }
};

function getTodayStart() {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date.getTime();
}

export function claimAdReward({
  telegramId,
  network,
  verified = false
}) {
  if (!verified) {
    throw new Error(
      "Ad completion was not verified"
    );
  }

  if (!SETTINGS[network]) {
    throw new Error("Invalid ad network");
  }

  const db = loadDatabase();

  const user = db.users.find(
    u => u.telegram_id === String(telegramId)
  );

  if (!user) {
    throw new Error("User not found");
  }

  const settings = SETTINGS[network];

  const today = getTodayStart();

  const viewsToday = db.adViews.filter(
    view =>
      view.telegram_id === String(telegramId) &&
      view.network === network &&
      view.created_at >= today
  ).length;

  if (viewsToday >= settings.dailyLimit) {
    throw new Error(
      "Daily ad limit reached"
    );
  }

  const lastAd =
    network === "adsgram"
      ? Number(user.last_adsgram_at || 0)
      : Number(user.last_monetag_at || 0);

  if (
    Date.now() - lastAd <
    settings.cooldown * 1000
  ) {
    throw new Error(
      "Please wait before watching another ad"
    );
  }

  const sessionId = crypto.randomUUID();

  user.balance =
    Number(user.balance || 0) +
    settings.reward;

  if (network === "adsgram") {
    user.adsgram_today =
      viewsToday + 1;

    user.last_adsgram_at =
      Date.now();
  }

  if (network === "monetag") {
    user.monetag_today =
      viewsToday + 1;

    user.last_monetag_at =
      Date.now();
  }

  db.adViews.push({
    id: crypto.randomUUID(),
    telegram_id: String(telegramId),
    network,
    reward: settings.reward,
    session_id: sessionId,
    status: "verified",
    created_at: Date.now()
  });

  saveDatabase(db);

  return {
    sessionId,
    network,
    reward: settings.reward,
    balance: user.balance
  };
}
