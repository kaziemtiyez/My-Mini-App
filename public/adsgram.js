let adsGramInitialized = false;

export async function initializeAdsGram(blockId) {
  if (!blockId || blockId.startsWith("YOUR_")) {
    console.warn(
      "AdsGram Block ID is not configured."
    );

    return false;
  }

  if (adsGramInitialized) {
    return true;
  }

  if (!window.Adsgram) {
    console.warn(
      "AdsGram SDK is not loaded."
    );

    return false;
  }

  try {
    window.adsgramController =
      window.Adsgram.init({
        blockId
      });

    adsGramInitialized = true;

    return true;
  } catch (error) {
    console.error(
      "AdsGram initialization failed:",
      error
    );

    return false;
  }
}

export async function showAdsGramAd() {
  if (!window.adsgramController) {
    throw new Error(
      "AdsGram is not initialized"
    );
  }

  return window.adsgramController.show();
}
