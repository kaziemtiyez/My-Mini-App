# 💰 Mini Dollar Earn

Telegram Mini App earning platform.

## Features

- Telegram Mini App
- AdsGram integration
- Monetag integration
- Daily ad limits
- Configurable ad rewards
- Referral system
- Referral leaderboard
- Binance TRC20 withdrawal
- PayPal withdrawal
- $10 minimum withdrawal
- Pending withdrawal system
- Admin approval
- Automatic withdrawal notification
- Telegram user authentication
- Admin ID protection
- Anti-duplicate reward foundation

## Security

Never expose:

- BOT_TOKEN
- ADMIN_TELEGRAM_ID
- WITHDRAWAL_CHAT_ID
- private API credentials

`.env` must never be committed to GitHub.

## Run

Install dependencies:

npm install

Start server:

npm start

Start Telegram bot:

node bot/start.js

## Configuration

Copy `.env.example` to `.env`.

Add:

BOT_TOKEN
ADMIN_TELEGRAM_ID
WITHDRAWAL_CHAT_ID
MINI_APP_URL

## Withdrawal

Minimum withdrawal is $10.

Available methods:

- Binance TRC20
- PayPal

All withdrawal requests initially become PENDING.

Admin approves or rejects them from the admin system.

## Advertising

Ad rewards must only be credited after the advertising provider's official completion event has been verified.

Never manually credit a user merely because an ad button was clicked.
