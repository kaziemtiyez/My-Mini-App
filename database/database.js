import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const databaseFile = path.join(dataDir, "database.json");

if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify(
      {
        users: [],
        adViews: [],
        referrals: [],
        withdrawals: [],
        adminLogs: []
      },
      null,
      2
    )
  );
}

export function loadDatabase() {
  try {
    return JSON.parse(fs.readFileSync(databaseFile, "utf8"));
  } catch {
    return {
      users: [],
      adViews: [],
      referrals: [],
      withdrawals: [],
      adminLogs: []
    };
  }
}

export function saveDatabase(database) {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify(database, null, 2)
  );
}

export function updateDatabase(callback) {
  const database = loadDatabase();

  const result = callback(database);

  saveDatabase(database);

  return result;
}
