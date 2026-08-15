import crypto from "crypto";
import {
  loadDatabase,
  saveDatabase
} from "../database/database.js";

export function getOrCreateUser(telegramUser, referralCode = null) {
  const db = loadDatabase();

  const telegramId = String(telegramUser.id);

  let user = db.users.find(
    u => u.telegram_id === telegramId
  );

  if (user) {
    user.username = telegramUser.username || user.username;
    user.first_name = telegramUser.first_name || user.first_name;
    user.last_name = telegramUser.last_name || user.last_name;
    user.updated_at = Date.now();

    saveDatabase(db);

    return sanitizeUser(user);
  }

  const now = Date.now();

  user = {
    id: crypto.randomUUID(),

    telegram_id: telegramId,

    username: telegramUser.username || "",
    first_name: telegramUser.first_name || "",
    last_name: telegramUser.last_name || "",

    balance: 0,
    referral_balance: 0,

    referred_by: referralCode || null,
    referral_count: 0,

    adsgram_today: 0,
    monetag_today: 0,

    last_adsgram_at: 0,
    last_monetag_at: 0,

    created_at: now,
    updated_at: now
  };

  db.users.push(user);

  saveDatabase(db);

  return sanitizeUser(user);
}

export function findUser(telegramId) {
  const db = loadDatabase();

  return db.users.find(
    u => u.telegram_id === String(telegramId)
  );
}

export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    telegram_id: user.telegram_id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,

    balance: Number(user.balance || 0),
    referral_balance: Number(user.referral_balance || 0),

    referral_count: Number(user.referral_count || 0),

    adsgram_today: Number(user.adsgram_today || 0),
    monetag_today: Number(user.monetag_today || 0),

    created_at: user.created_at
  };
}
