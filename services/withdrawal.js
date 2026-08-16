import crypto from "crypto";
import { loadDatabase, saveDatabase } from "../database/database.js";

const MINIMUM_WITHDRAWAL = 10;

export function createWithdrawal({
  telegramId,
  amount,
  method,
  destination
}) {
  const db = loadDatabase();

  const user = db.users.find(
    u => u.telegram_id === String(telegramId)
  );

  if (!user) throw new Error("User not found");

  amount = Number(amount);

  if (!Number.isFinite(amount) || amount < MINIMUM_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is $${MINIMUM_WITHDRAWAL}`);
  }

  if (amount > Number(user.balance || 0)) {
    throw new Error("Insufficient balance");
  }

  const pending = db.withdrawals.find(
    w =>
      w.telegram_id === String(telegramId) &&
      w.status === "pending"
  );

  if (pending) {
    throw new Error("You already have a pending withdrawal");
  }

  const validMethods = ["binance_trc20", "paypal"];

  if (!validMethods.includes(method)) {
    throw new Error("Invalid withdrawal method");
  }

  if (!destination || String(destination).length < 3) {
    throw new Error("Invalid withdrawal destination");
  }

  const withdrawal = {
    id: crypto.randomUUID(),
    telegram_id: String(telegramId),
    amount,
    method,
    destination: String(destination),
    status: "pending",
    admin_note: null,
    created_at: Date.now(),
    updated_at: Date.now()
  };

  user.balance =
    Number(user.balance || 0) - amount;

  db.withdrawals.push(withdrawal);

  saveDatabase(db);

  return withdrawal;
}

export function getUserWithdrawals(telegramId) {
  const db = loadDatabase();

  return db.withdrawals
    .filter(
      w => w.telegram_id === String(telegramId)
    )
    .sort((a, b) => b.created_at - a.created_at)
    .map(w => ({
      id: w.id,
      amount: w.amount,
      method: w.method,
      status: w.status,
      created_at: w.created_at,
      updated_at: w.updated_at
    }));
}

export function getPendingWithdrawals() {
  const db = loadDatabase();

  return db.withdrawals
    .filter(w => w.status === "pending")
    .sort((a, b) => a.created_at - b.created_at);
}

export function updateWithdrawal(
  withdrawalId,
  status,
  adminNote = ""
) {
  const db = loadDatabase();

  const withdrawal = db.withdrawals.find(
    w => w.id === withdrawalId
  );

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  if (withdrawal.status !== "pending") {
    throw new Error("Withdrawal already processed");
  }

  const user = db.users.find(
    u => u.telegram_id === withdrawal.telegram_id
  );

  if (status === "rejected" && user) {
    user.balance =
      Number(user.balance || 0) +
      Number(withdrawal.amount || 0);
  }

  withdrawal.status = status;
  withdrawal.admin_note = adminNote;
  withdrawal.updated_at = Date.now();

  saveDatabase(db);

  return withdrawal;
}
