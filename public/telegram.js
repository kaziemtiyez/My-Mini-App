(function () {
  if (!window.Telegram) {
    console.warn(
      "Telegram WebApp SDK unavailable."
    );

    return;
  }

  const tg =
    window.Telegram.WebApp;

  tg.ready();
  tg.expand();

  window.TelegramApp = tg;
})();
