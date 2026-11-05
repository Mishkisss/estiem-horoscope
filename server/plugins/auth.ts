import { createAuthPlugin } from "@agent-native/core/server";

// Email/password auth with optional Google OAuth (enabled automatically when
// GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set). No marketing copy — a
// blank app defines its own brand on the login page when it needs one by setting loginHtml in this config.
export default createAuthPlugin({
  rootAuth: false, // auth is not serverd on / by default
  // Public site: every page is readable without a session (content is edited
  // via the sync-horoscope action, not from an admin UI). Prefix list, kept in
  // sync with PUBLIC_PATHS in app/root.tsx — the client gate is separate.
  workspaceAppPublicPaths: ["/", "/signs", "/about", "/seasons"],
});
