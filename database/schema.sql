CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,

    balance REAL DEFAULT 0,
    referral_balance REAL DEFAULT 0,

    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER DEFAULT 0,

    adsgram_today INTEGER DEFAULT 0,
    monetag_today INTEGER DEFAULT 0,

    last_adsgram_at INTEGER DEFAULT 0,
    last_monetag_at INTEGER DEFAULT 0,

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ad_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    telegram_id TEXT NOT NULL,
    network TEXT NOT NULL,

    reward REAL NOT NULL,
    session_id TEXT UNIQUE NOT NULL,

    status TEXT DEFAULT 'verified',

    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    referrer_id TEXT NOT NULL,
    referred_id TEXT UNIQUE NOT NULL,

    reward REAL DEFAULT 0,
    status TEXT DEFAULT 'active',

    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    telegram_id TEXT NOT NULL,

    amount REAL NOT NULL,
    method TEXT NOT NULL,
    destination TEXT NOT NULL,

    status TEXT DEFAULT 'pending',

    admin_note TEXT DEFAULT NULL,

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,

    target_user TEXT DEFAULT NULL,
    details TEXT DEFAULT NULL,

    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_telegram
ON users(telegram_id);

CREATE INDEX IF NOT EXISTS idx_ads_telegram
ON ad_views(telegram_id);

CREATE INDEX IF NOT EXISTS idx_withdrawals_telegram
ON withdrawals(telegram_id);

CREATE INDEX IF NOT EXISTS idx_withdrawals_status
ON withdrawals(status);
