// Client-side consent store for advertising (GDPR/ePrivacy). Framework-free
// pub/sub so the consent bar and every ad slot on the page stay in sync
// without prop drilling.
//
// SSR rules: the server and the first client render must both report `null`
// (no hydration mismatch), so localStorage is only read inside `useEffect`.
import { useCallback, useEffect, useState } from "react";

import { CONSENT_KEY, type AdsConsent } from "@/lib/ads-config";

const listeners = new Set<(consent: AdsConsent) => void>();

export function readConsent(): AdsConsent {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(next: "granted" | "declined"): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, next);
  } catch {
    // Private mode / storage disabled — still honour the choice this session.
  }
  for (const listener of listeners) listener(next);
}

/**
 * Current advertising consent plus its setter. Starts at `null` on both the
 * server and the first client render, then resolves from localStorage after
 * mount; subscribing keeps every mounted `AdSlot`/`AdConsentBar` consistent.
 */
export function useAdsConsent(): [AdsConsent, (next: "granted" | "declined") => void] {
  const [consent, setConsent] = useState<AdsConsent>(null);

  useEffect(() => {
    setConsent(readConsent());
    const listener = (next: AdsConsent) => setConsent(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((next: "granted" | "declined") => saveConsent(next), []);
  return [consent, update];
}
