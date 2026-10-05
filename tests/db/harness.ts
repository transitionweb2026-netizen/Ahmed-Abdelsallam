/**
 * In-process Postgres (PGlite) with minimal stand-ins for the parts of
 * Supabase the migrations rely on: the anon / authenticated / service_role
 * roles, auth.users + auth.uid(), and storage.buckets + storage.objects with
 * Row Level Security. The real migration files then run unmodified, and
 * tests act as a given user by switching role and JWT claims, exactly the
 * way PostgREST does.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite, type Transaction } from "@electric-sql/pglite";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;

  create schema auth;
  create table auth.users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;

  create schema storage;
  create table storage.buckets (
    id text primary key,
    name text not null,
    public boolean not null default false,
    file_size_limit bigint,
    allowed_mime_types text[]
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets (id),
    name text not null,
    owner uuid default auth.uid()
  );
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated, service_role;
  grant select, insert, update, delete on storage.objects to anon, authenticated, service_role;

  grant usage on schema public to anon, authenticated, service_role;
`;

export function migrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
}

export async function applyMigrations(db: PGlite): Promise<void> {
  for (const file of migrationFiles()) {
    await db.exec(readFileSync(join(MIGRATIONS_DIR, file), "utf8"));
  }
}

/** A fresh database with the Supabase stand-ins and every migration applied. */
export async function createDatabase(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(SUPABASE_STUB);
  await applyMigrations(db);
  // service_role (scripts) may do anything; Supabase grants it everything.
  await db.exec(`
    grant all on all tables in schema public to service_role;
    grant execute on all functions in schema public to service_role;
  `);
  return db;
}

export type Actor = { role: "anon" } | { role: "authenticated"; userId: string } | { role: "service_role" };

/**
 * Runs `fn` as the given actor inside a transaction that is always rolled
 * back, so tests never leak changes into each other unless they commit
 * through `persist`.
 */
export async function as<T>(db: PGlite, actor: Actor, fn: (tx: Transaction) => Promise<T>, persist = false): Promise<T> {
  let result: T | undefined;
  const ROLLBACK = Symbol("rollback");
  try {
    await db.transaction(async (tx) => {
      const claims = actor.role === "authenticated" ? { sub: actor.userId, role: "authenticated" } : { role: actor.role };
      await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
      await tx.exec(`set local role ${actor.role}`);
      result = await fn(tx);
      if (!persist) throw ROLLBACK;
    });
  } catch (error) {
    if (error !== ROLLBACK) throw error;
  }
  return result as T;
}

/** Runs `fn` as `actor` and returns the error message (or null when it succeeds). */
export async function failureOf(db: PGlite, actor: Actor, fn: (tx: Transaction) => Promise<unknown>): Promise<string | null> {
  try {
    await as(db, actor, fn);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export async function createUser(db: PGlite, email: string): Promise<string> {
  const { rows } = await db.query<{ id: string }>(`insert into auth.users (email) values ($1) returning id`, [email]);
  return rows[0].id;
}
