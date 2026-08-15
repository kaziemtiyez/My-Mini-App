import { adsConfig } from "../config/ads.js";

export function getMonetagConfig() {
  return {
    enabled: adsConfig.monetag.enabled,
    placementId: adsConfig.monetag.placementId,
    dailyLimit: adsConfig.monetag.dailyLimit,
    reward: adsConfig.monetag.reward,
    cooldownSeconds: adsConfig.monetag.cooldownSeconds
  };
}

export function isMonetagEnabled() {
  return adsConfig.monetag.enabled === true;
}
