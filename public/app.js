const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const state = {
  user: null,
  config: null
};

const $ = id =>
  document.getElementById(id);

function apiHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Telegram-Init-Data":
      tg?.initData || ""
  };
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiHeaders(),
      ...(options.headers || {})
    }
  });

  return response.json();
}

async function login() {
  const startParam =
    tg?.initDataUnsafe?.start_param || "";

  const result = await api(
    "/api/user/login",
    {
      method: "POST",
      body: JSON.stringify({
        referralCode: startParam || null
      })
    }
  );

  if (!result.success) {
    throw new Error(result.message);
  }

  state.user = result.user;

  renderUser();
}

async function loadConfig() {
  const result =
    await api("/api/config");

  if (result.success) {
    state.config = result.config;
  }
}

function renderUser() {
  const user = state.user;

  if (!user) return;

  $("balance").textContent =
    `$${Number(user.balance).toFixed(2)}`;

  $("referrals").textContent =
    user.referral_count || 0;

  $("adsToday").textContent =
    Number(user.adsgram_today || 0) +
    Number(user.monetag_today || 0);

  $("welcome").textContent =
    `Hello, ${user.first_name || "User"}`;

  $("avatar").textContent =
    (user.first_name || "U")
      .charAt(0)
      .toUpperCase();
}

async function watchAd(network) {
  alert(
    `${network.toUpperCase()} ad integration will be activated after the publisher SDK is configured.`
  );
}

async function showReferral() {
  const result =
    await api("/api/referral/info");

  if (!result.success) return;

  const botUsername =
    tg?.initDataUnsafe?.user?.username ||
    "YOUR_BOT";

  const link =
    `https://t.me/${botUsername}?startapp=${result.referralCode}`;

  $("pageContent").innerHTML = `
    <h2>👥 Referral</h2>

    <p>
      Invite friends and earn referral rewards.
    </p>

    <p>
      Referrals:
      <strong>${result.referralCount}</strong>
    </p>

    <p>
      Referral Earnings:
      <strong>$${Number(
        result.referralBalance
      ).toFixed(2)}</strong>
    </p>

    <textarea
      readonly
      style="width:100%;height:70px"
    >${link}</textarea>
  `;
}

async function showLeaderboard() {
  const result =
    await api(
      "/api/referral/leaderboard"
    );

  const rows =
    result.leaderboard
      .map(item => `
        <div style="
          padding:10px 0;
          border-bottom:1px solid #292929
        ">
          #${item.rank}
          ${item.first_name}
          — ${item.referrals} referrals
        </div>
      `)
      .join("");

  $("pageContent").innerHTML = `
    <h2>🏆 Top Referrers</h2>
    ${rows}
  `;
}

async function showWithdraw() {
  $("pageContent").innerHTML = `
    <h2>💳 Withdraw</h2>

    <p>
      Minimum withdrawal: <b>$10.00</b>
    </p>

    <input
      id="withdrawAmount"
      type="number"
      min="10"
      step="0.01"
      placeholder="Amount"
      style="width:100%;padding:13px;margin:6px 0"
    >

    <select
      id="withdrawMethod"
      style="width:100%;padding:13px;margin:6px 0"
    >
      <option value="binance_trc20">
        Binance TRC20
      </option>

      <option value="paypal">
        PayPal
      </option>
    </select>

    <input
      id="withdrawDestination"
      placeholder="Wallet address / PayPal email"
      style="width:100%;padding:13px;margin:6px 0"
    >

    <button
      id="withdrawSubmit"
      class="earn-button"
    >
      Submit Withdrawal
    </button>
  `;

  $("withdrawSubmit").onclick =
    submitWithdrawal;
}

async function submitWithdrawal() {
  const amount =
    Number($("withdrawAmount").value);

  const method =
    $("withdrawMethod").value;

  const destination =
    $("withdrawDestination").value.trim();

  const result = await api(
    "/api/withdraw",
    {
      method: "POST",
      body: JSON.stringify({
        amount,
        method,
        destination
      })
    }
  );

  alert(
    result.success
      ? "Withdrawal submitted successfully."
      : result.message
  );

  if (result.success) {
    await login();
  }
}

function showHome() {
  $("pageContent").innerHTML = `
    <h2>Dashboard</h2>
    <p>
      Watch verified ads, complete tasks,
      invite friends and withdraw when
      your balance reaches $10.
    </p>
  `;
}

function setupNavigation() {
  document
    .querySelectorAll("[data-page]")
    .forEach(button => {
      button.addEventListener(
        "click",
        async () => {

          const page =
            button.dataset.page;

          document
            .querySelectorAll(
              ".bottom-nav button"
            )
            .forEach(b =>
              b.classList.remove("active")
            );

          button.classList.add("active");

          if (page === "home") {
            showHome();
          }

          if (page === "referral") {
            await showReferral();
          }

          if (page === "leaderboard") {
            await showLeaderboard();
          }

          if (page === "withdraw") {
            await showWithdraw();
          }

          if (page === "profile") {
            $("pageContent").innerHTML = `
              <h2>👤 Profile</h2>
              <p>
                ID:
                <code>
                  ${state.user?.telegram_id || ""}
                </code>
              </p>
              <p>
                Balance:
                $${Number(
                  state.user?.balance || 0
                ).toFixed(2)}
              </p>
            `;
          }

          if (page === "earn") {
            showHome();
          }
        }
      );
    });
}

$("adsgramButton").onclick =
  () => watchAd("AdsGram");

$("monetagButton").onclick =
  () => watchAd("Monetag");

async function start() {
  try {
    await loadConfig();
    await login();
    setupNavigation();
    showHome();
  } catch (error) {
    console.error(error);

    document.body.innerHTML = `
      <div style="
        padding:30px;
        text-align:center;
        color:white
      ">
        <h2>Unable to connect</h2>
        <p>Please open this Mini App from Telegram.</p>
      </div>
    `;
  }
}

start();
