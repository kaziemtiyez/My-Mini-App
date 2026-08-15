import { adsConfig } from "../config/ads.js";

export function getAdsGramConfig() {
  return {
    enabled: adsConfig.adsgram.enabled,
    blockId: adsConfig.adsgram.blockId,
    dailyLimit: adsConfig.adsgram.dailyLimit,
    reward: adsConfig.adsgram.reward,
    cooldownSeconds: adsConfig.adsgram.cooldownSeconds
  };
}

export function isAdsGramEnabled() {
  return adsConfig.adsgram.enabled === true;
}
