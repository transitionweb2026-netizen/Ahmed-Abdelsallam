/**
 * The admin dashboard (DEPLOYMENT_TARGET=admin) renders the same
 * public-look-alike routes as the real site, with no build step to strip
 * them — these two files are what keep that mirror out of Google instead.
 * Crawling must stay allowed (so noindex is actually seen), while every
 * page must resolve to index:false, follow:false. The public export
 * (DEPLOYMENT_TARGET unset or "export") must be unaffected either way.
 */
import { afterEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { resolvePageRobots } from "@/lib/seo";

const ORIGINAL_TARGET = process.env.DEPLOYMENT_TARGET;

afterEach(() => {
  if (ORIGINAL_TARGET === undefined) delete process.env.DEPLOYMENT_TARGET;
  else process.env.DEPLOYMENT_TARGET = ORIGINAL_TARGET;
});

describe("app/robots.ts", () => {
  it("allows crawling and omits the sitemap for the admin deployment", () => {
    process.env.DEPLOYMENT_TARGET = "admin";
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" } });
  });

  it("allows crawling and publishes the sitemap for the public export", () => {
    process.env.DEPLOYMENT_TARGET = "export";
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBeTruthy();
  });

  it("allows crawling and publishes the sitemap for the ordinary Vercel build (no target set)", () => {
    delete process.env.DEPLOYMENT_TARGET;
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBeTruthy();
  });
});

describe("resolvePageRobots", () => {
  it("forces noindex,nofollow on the admin deployment regardless of the CMS's own index toggle", () => {
    process.env.DEPLOYMENT_TARGET = "admin";
    expect(resolvePageRobots(true)).toEqual({ index: false, follow: false });
    expect(resolvePageRobots(false)).toEqual({ index: false, follow: false });
  });

  it("follows the CMS's index toggle on the public export", () => {
    process.env.DEPLOYMENT_TARGET = "export";
    expect(resolvePageRobots(true)).toEqual({ index: true, follow: true });
    expect(resolvePageRobots(false)).toEqual({ index: false, follow: true });
  });

  it("follows the CMS's index toggle on the ordinary Vercel build (no target set)", () => {
    delete process.env.DEPLOYMENT_TARGET;
    expect(resolvePageRobots(true)).toEqual({ index: true, follow: true });
    expect(resolvePageRobots(false)).toEqual({ index: false, follow: true });
  });
});
