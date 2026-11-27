/**
 * Hard-disabled until the Hostinger publish pipeline is fully wired up and
 * verified end to end: `GITHUB_PUBLISH_TOKEN` set in Vercel, the GitHub
 * Actions build's own environment variables set, and
 * `.github/workflows/publish-site.yml` actually pushed (GitHub does not see
 * it yet — none of this exists as a live workflow today). Flipping this to
 * `true` is a deliberate, reviewed code change, not a runtime toggle: a
 * false positive here would publish the live site with incomplete or
 * placeholder content, with nothing to show it happened. See
 * docs/deploy/publish-pipeline.md for the checklist before re-enabling.
 *
 * Plain exported values, not a "use server" module, so both the server
 * action and the client-side button can read the same flag directly.
 */
export const PUBLISHING_ENABLED = false;

export const PUBLISHING_DISABLED_MESSAGE =
  "Publishing is temporarily disabled until the deployment pipeline is fully configured and verified. See docs/deploy/publish-pipeline.md.";
