export const adsConfig = {
  adsgram: {
    enabled: true,

    // AdsGram dashboard থেকে তোমার Block ID বসাবে
    blockId:
      process.env.ADSGRAM_BLOCK_ID || ""
  },

  monetag: {
    enabled: true,

    // Monetag dashboard-এর MAIN zone ID
    zoneId:
      process.env.MONETAG_ZONE_ID || "",

    sdkFunction:
      process.env.MONETAG_SDK_FUNCTION || ""
  }
};
