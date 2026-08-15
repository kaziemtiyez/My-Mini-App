export const adsConfig = {
  adsgram: {
    enabled: true,

    // AdsGram থেকে পাওয়া Block ID এখানে বসবে
    blockId: "YOUR_ADSGRAM_BLOCK_ID",

    dailyLimit: 15,

    reward: 0.20,

    cooldownSeconds: 3
  },

  monetag: {
    enabled: true,

    // Monetag integration identifier এখানে বসবে
    placementId: "YOUR_MONETAG_PLACEMENT_ID",

    dailyLimit: 10,

    reward: 0.20,

    cooldownSeconds: 3
  }
};
