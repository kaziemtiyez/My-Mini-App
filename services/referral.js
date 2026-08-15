import crypto from "crypto";
import {
  loadDatabase,
  saveDatabase
} from "../database/database.js";

const REFERRAL_REWARD = 0.50;

export function createReferralCode(telegramId) {
  return String(telegramId);
}

export function processReferral(referrerId, newUserId) {
  if (!referrerId || !newUserId) {
    return false;
  }

  if (String(referrerId) === String(newUserId)) {
    return false;
  }

  const db = loadDatabase();

  const newUser = db.users.find(
    u => u.telegram_id === String(newUserId)
  );

  const referrer = db.users.find(
    u => u.telegram_id === String(referrerId)
  );

  if (!newUser || !referrer) {
    return false;
  }

  if (newUser.referred_by) {
    return false;
  }

  const alreadyReferred = db.referrals.find(
    r => r.referred_id === String(newUserId)
  );

  if (alreadyReferred) {
    return false;
  }

  newUser.referred_by = String(referrerId);

  referrer.referral_count =
    Number(referrer.referral_count || 0) + 1;

  referrer.referral_balance =
    Number(referrer.referral_balance || 0) +
    REFERRAL_REWARD;

  referrer.balance =
    Number(referrer.balance || 0) +
    REFERRAL_REWARD;

  db.referrals.push({
    id: crypto.randomUUID(),
    referrer_id: String(referrerId),
    referred_id: String(newUserId),
    reward: REFERRAL_REWARD,
    status: "active",
    created_at: Date.now()
  });

  saveDatabase(db);

  return true;
}

export function getLeaderboard(limit = 10) {
  const db = loadDatabase();

  return [...db.users]
    .sort(
      (a, b) =>
        Number(b.referral_count || 0) -
        Number(a.referral_count || 0)
    )
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      username: user.username || "User",
      first_name: user.first_name || "User",
      referrals: Number(user.referral_count || 0)
    }));
}
