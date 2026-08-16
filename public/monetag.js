let monetagInitialized = false;

export function initializeMonetag() {
  if (monetagInitialized) {
    return true;
  }

  /*
   * Monetag publisher SDK initialization
   * will be connected after your publisher
   * account/placement is configured.
   */

  monetagInitialized = true;

  return true;
}

export async function showMonetagAd() {
  /*
   * The exact Monetag SDK call depends on
   * the ad format enabled in your publisher
   * account.
   *
   * Never credit a user before the official
   * ad-completion event is received.
   */

  throw new Error(
    "Monetag placement is not configured yet"
  );
}
