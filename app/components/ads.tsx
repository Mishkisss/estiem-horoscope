// Advertising surfaces: a display slot and the GDPR consent bar that gates
// it. Both render nothing until `AD_CONFIG.enabled` is flipped and a key is
// set (see app/lib/ads-config.ts and docs/monetization-playbook.md), so this
// code ships dormant.
//
// The Adsterra embed uses the classic `atOptions` + invoke.js snippet, whose
// script relies on `document.write` — safe only while its *own* document is
// being parsed. Hosting the snippet in a srcdoc iframe gives it exactly that
// context on every render, including after client-side navigation, and the
// main document is never touched (no hydration risk, no wiped page).
import { Link } from "react-router";

import { AD_CONFIG, adsActive } from "@/lib/ads-config";
import { useAdsConsent } from "@/lib/ads-consent";

function bannerDocument(): string {
  const options = JSON.stringify({
    format: "iframe",
    height: AD_CONFIG.height,
    width: AD_CONFIG.width,
    params: {},
  });
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">atOptions = ${options};<\/script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${AD_CONFIG.adsterraKey}/invoke.js"></script>
  </body>
</html>`;
}

/**
 * One display-banner placement. Renders nothing when advertising is switched
 * off or the visitor has not consented (declined → no request at all), and
 * reserves the exact banner box so the page never shifts when it appears.
 */
export function AdSlot() {
  const [consent] = useAdsConsent();

  if (!adsActive() || consent !== "granted") return null;

  return (
    <section
      aria-label="Advertisement"
      className="flex flex-col items-center gap-2 px-5 py-8 md:px-16"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94B0A1]/70">
        Advertisement
      </span>
      <iframe
        title="Advertisement"
        srcDoc={bannerDocument()}
        width={AD_CONFIG.width}
        height={AD_CONFIG.height}
        loading="lazy"
        style={{ width: AD_CONFIG.width, height: AD_CONFIG.height }}
        className="block border-0"
      />
    </section>
  );
}

/**
 * Bottom consent bar shown once advertising is live and no choice was made
 * yet. Stored via `useAdsConsent`; declining blocks every `AdSlot`.
 */
export function AdConsentBar() {
  const [consent, setConsent] = useAdsConsent();

  if (!adsActive() || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Advertising consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#94B0A1]/40 bg-[#174530] px-5 py-4 shadow-[0_-6px_24px_rgba(0,0,0,0.35)] md:px-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[840px] text-sm leading-relaxed text-[#94B0A1]">
          This site stays free with advertising. Our advertising partners may
          use cookies to show you relevant ads. Read the{" "}
          <Link to="/privacy" className="font-semibold text-[#FAD44D] underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="rounded-full border border-[#94B0A1] px-5 py-2 text-sm font-semibold text-white transition hover:border-[#FAD44D]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="rounded-full bg-[#FAD44D] px-5 py-2 text-sm font-bold text-[#174530] transition hover:brightness-105"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
