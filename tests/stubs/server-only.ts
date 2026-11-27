// Stands in for the real "server-only" package under vitest (plain Node, not
// Next's bundler, which is what actually enforces that guard at build time —
// outside it the real package just throws unconditionally on import).
export {};
