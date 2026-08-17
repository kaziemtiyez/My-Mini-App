# 🚀 Mini Dollar Earn Deployment

## 1. Install

npm install

## 2. Configure environment

Create `.env`.

Never upload `.env` to GitHub.

Add:

BOT_TOKEN=...
ADMIN_TELEGRAM_ID=...
WITHDRAWAL_CHAT_ID=...
MINI_APP_URL=https://your-domain.com

## 3. Start

npm start

## 4. Start Telegram bot

npm run bot

## 5. HTTPS

The Mini App must be available through HTTPS.

## 6. Telegram

Open BotFather.

Configure the bot's Mini App/Web App URL.

## 7. Withdrawal channel

Add the bot to the private channel/group.

Give the bot permission to send messages.

Set:

WITHDRAWAL_CHAT_ID

## 8. AdsGram

Create/configure your publisher account.

Obtain your Block ID.

Put it into:

config/ads.js

## 9. Monetag

Create/configure your publisher placement.

Put the placement identifier into:

config/ads.js

## 10. Test

Test:

- Telegram login
- Referral
- Ads
- Daily limit
- Balance
- Withdrawal
- Channel notification
- Admin approval
- Rejection/refund
