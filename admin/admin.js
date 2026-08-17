const tg =
  window.Telegram?.WebApp;

const API = "/api/admin";

function headers() {
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
      ...headers(),
      ...(options.headers || {})
    }
  });

  return response.json();
}

async function loadWithdrawals() {
  const result =
    await api(`${API}/withdrawals`);

  if (!result.success) {
    document.getElementById(
      "adminStatus"
    ).textContent = "Access denied";

    return;
  }

  document.getElementById(
    "adminStatus"
  ).textContent = "Admin verified";

  const list =
    document.getElementById(
      "withdrawals"
    );

  document.getElementById(
    "pendingWithdrawals"
  ).textContent =
    result.withdrawals.length;

  if (!result.withdrawals.length) {
    list.innerHTML =
      "<p>No pending withdrawals.</p>";

    return;
  }

  list.innerHTML =
    result.withdrawals
      .map(w => `
        <div class="withdrawal">

          <b>Amount:</b>
          $${Number(w.amount).toFixed(2)}
          <br>

          <b>Method:</b>
          ${w.method}
          <br>

          <b>User:</b>
          <code>${w.telegram_id}</code>
          <br>

          <b>Destination:</b>
          <code>${w.destination}</code>

          <div>
            <button
              class="approve"
              onclick="approve('${w.id}')"
            >
              APPROVE
            </button>

            <button
              class="reject"
              onclick="rejectRequest('${w.id}')"
            >
              REJECT
            </button>
          </div>

        </div>
      `)
      .join("");
}

async function approve(id) {
  const result =
    await api(
      `${API}/withdrawals/${id}/approve`,
      {
        method: "POST"
      }
    );

  alert(
    result.success
      ? "Withdrawal approved."
      : result.message
  );

  loadWithdrawals();
}

async function rejectRequest(id) {
  const note =
    prompt(
      "Reason for rejection:"
    ) || "Rejected by admin";

  const result =
    await api(
      `${API}/withdrawals/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({
          note
        })
      }
    );

  alert(
    result.success
      ? "Withdrawal rejected."
      : result.message
  );

  loadWithdrawals();
}

loadWithdrawals();
