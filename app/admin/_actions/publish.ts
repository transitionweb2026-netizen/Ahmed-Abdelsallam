"use server";

import { PUBLISHING_DISABLED_MESSAGE, PUBLISHING_ENABLED } from "@/lib/cms/admin/publish-config";
import { ActionError, requireAdmin, run } from "@/lib/cms/admin/session";
import type { ActionResult } from "@/lib/cms/admin/types";

// Not a secret — just which repo/workflow to call. The actual credential is
// GITHUB_PUBLISH_TOKEN, a server-only env var (never NEXT_PUBLIC_*).
const REPO = "transitionweb2026-netizen/Ahmed-Abdelsallam";
const WORKFLOW_FILE = "publish-site.yml";
const GITHUB_API = "https://api.github.com";

export type PublishPhase = "idle" | "queued" | "building" | "uploading" | "successful" | "failed";
export interface PublishStatus {
  phase: PublishPhase;
  /** Link to the run on GitHub, for the details a toast can't show. */
  runUrl: string | null;
  updatedAt: string | null;
}

interface GithubRun {
  id: number;
  status: "queued" | "in_progress" | "completed";
  conclusion: string | null;
  html_url: string;
  updated_at: string;
}

function token(): string {
  const value = process.env.GITHUB_PUBLISH_TOKEN;
  if (!value) throw new ActionError("Publishing isn't set up yet (GITHUB_PUBLISH_TOKEN is missing). Ask the developer to finish the deployment setup.");
  return value;
}

async function githubFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new ActionError(`GitHub rejected the request (HTTP ${response.status}). Check that GITHUB_PUBLISH_TOKEN is valid and can access this repo's Actions.`);
  return response.json() as Promise<T>;
}

async function latestRun(): Promise<GithubRun | null> {
  const data = await githubFetch<{ workflow_runs: GithubRun[] }>(`/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1&event=workflow_dispatch`);
  return data.workflow_runs[0] ?? null;
}

async function statusOf(latest: GithubRun): Promise<PublishStatus> {
  const { html_url: runUrl, updated_at: updatedAt } = latest;
  if (latest.status === "completed") return { phase: latest.conclusion === "success" ? "successful" : "failed", runUrl, updatedAt };
  if (latest.status === "queued") return { phase: "queued", runUrl, updatedAt };

  // in_progress — the "deploy" job starting is what makes this "uploading"
  // rather than "building" (see .github/workflows/publish-site.yml).
  const jobs = await githubFetch<{ jobs: { name: string; status: string }[] }>(`/repos/${REPO}/actions/runs/${latest.id}/jobs`);
  const deploying = jobs.jobs.some((job) => job.name === "deploy" && job.status !== "queued");
  return { phase: deploying ? "uploading" : "building", runUrl, updatedAt };
}

/** Polled by the dashboard while a publish is active. */
export async function getPublishStatus(): Promise<ActionResult<PublishStatus>> {
  return run(async () => {
    await requireAdmin();
    const latest = await latestRun();
    if (!latest) return { phase: "idle", runUrl: null, updatedAt: null };
    return statusOf(latest);
  });
}

/** The "Publish Live Site" button. Refuses to start a second run while one is already active. */
export async function publishLiveSite(): Promise<ActionResult<PublishStatus>> {
  return run(async () => {
    await requireAdmin();
    // Fail closed: GITHUB_PUBLISH_TOKEN being set is not enough on its own
    // to trust this pipeline (see lib/cms/admin/publish-config.ts) — don't
    // fall through to dispatching a build on a half-configured setup.
    if (!PUBLISHING_ENABLED) throw new ActionError(PUBLISHING_DISABLED_MESSAGE);
    const latest = await latestRun();
    if (latest && latest.status !== "completed") {
      throw new ActionError("A publish is already running — wait for it to finish before starting another.");
    }
    await githubFetch(`/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
      method: "POST",
      body: JSON.stringify({ ref: "main" }),
    });
    return { phase: "queued", runUrl: null, updatedAt: null };
  });
}
