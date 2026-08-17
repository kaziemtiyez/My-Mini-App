function loadScript(src) {
  return new Promise(
    (resolve, reject) => {

      const script =
        document.createElement("script");

      script.src = src;
      script.async = true;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    }
  );
}

async function loadAdvertisingSDKs() {

  try {

    /*
     * AdsGram SDK URL/loader should be
     * configured according to the current
     * publisher documentation and your
     * assigned block.
     */

    console.log(
      "Advertising SDK loader ready."
    );

  } catch (error) {

    console.error(
      "Ad SDK loading failed:",
      error
    );

  }

}

loadAdvertisingSDKs();
