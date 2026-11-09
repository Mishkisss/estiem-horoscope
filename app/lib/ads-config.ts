// Advertising master switch — configuration lives in code, not env vars
// (see DEVELOPING.md), so enabling ads is a reviewable one-line diff plus a
// deploy. The site ships with advertising OFF; the activation procedure is
// documented in docs/monetization-playbook.md and is driven by
// `node scripts/enable-ads.mjs <key>` so nobody hand-edits this file under
// pressure.
//
// GDPR/ePrivacy note: the audience is European, so ad frames are only mounted
// after the visitor presses "Accept" in the consent bar (`AdConsentBar`).
// The choice is stored in localStorage under CONSENT_KEY and never leaves the
// browser. Declining means no advertising request is made at all.
export const AD_CONFIG = {
  /** Master switch — flipped to true only on activation day. */
  enabled: false,
  /**
   * Adsterra display-banner "Website key" (the string in the network's
   * embed snippet). Not a secret: it is public by design because it ships
   * inside page HTML, which is why it may live in the repo.
   */
  adsterraKey: "",
  /** Banner geometry the key was created for in Adsterra. */
  width: 300,
  height: 250,
} as const;

export const CONSENT_KEY = "estiem-ads-consent";

export type AdsConsent = "granted" | "declined" | null;

/** True only when ads are both switched on and a banner key is configured. */
export function adsActive(): boolean {
  return AD_CONFIG.enabled && AD_CONFIG.adsterraKey.length > 0;
}
