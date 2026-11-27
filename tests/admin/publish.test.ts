/**
 * The Hostinger publish pipeline isn't fully wired up yet (GITHUB_PUBLISH_TOKEN
 * missing in Vercel, the GitHub Actions build's own env vars missing, and the
 * workflow file itself not pushed) — lib/cms/admin/publish-config.ts hard-disables
 * triggering it until all of that is verified. This proves the real exported
 * `publishLiveSite` action actually refuses, and never reaches out to GitHub to
 * do it, rather than relying on GitHub to reject an incomplete request.
 *
 * `@/lib/cms/admin/session` is mocked only to stand in for an authenticated
 * admin (it needs real cookies/Supabase, unavailable here) — everything this
 * test actually asserts on is the real, unmocked publish action and config flag.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { PUBLISHING_DISABLED_MESSAGE, PUBLISHING_ENABLED } from "@/lib/cms/admin/publish-config";

vi.mock("@/lib/cms/admin/session", () => {
  class ActionError extends Error {}
  return {
    ActionError,
    requireAdmin: vi.fn().mockResolvedValue({ status: "admin", userId: "test-user", email: "owner@example.com", role: "owner" }),
    run: async <T>(body: () => Promise<T>) => {
      try {
        return { ok: true as const, data: await body() };
      } catch (error) {
        if (error instanceof ActionError) return { ok: false as const, error: error.message };
        throw error;
      }
    },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("publish-config", () => {
  it("defaults to disabled", () => {
    expect(PUBLISHING_ENABLED).toBe(false);
  });

  it("gives a clear, actionable message", () => {
    expect(PUBLISHING_DISABLED_MESSAGE).toMatch(/disabled/i);
    expect(PUBLISHING_DISABLED_MESSAGE).toContain("docs/deploy/publish-pipeline.md");
  });
});

describe("publishLiveSite", () => {
  it("refuses to publish while disabled, without ever calling GitHub", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { publishLiveSite } = await import("@/app/admin/_actions/publish");

    const result = await publishLiveSite();

    expect(result).toEqual({ ok: false, error: PUBLISHING_DISABLED_MESSAGE });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
