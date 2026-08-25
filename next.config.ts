import type { NextConfig } from "next";

/**
 * Seed the per-build enrichment cache key (ADR 0004).
 *
 * Next's Data Cache survives between builds — Vercel restores it across
 * deployments — so build-time GitHub stats would freeze at whatever the first
 * build fetched, and the scheduled rebuild would keep rebaking them. Every
 * enrichment request carries this value as a header, which changes the cache
 * key once per build while leaving the pages statically prerendered.
 *
 * Set here, in the parent build process, so every static-generation worker
 * inherits the same value and a repo is still fetched only once per build.
 */
process.env.ENRICHMENT_BUILD_ID ??=
  process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now());

const nextConfig: NextConfig = {};

export default nextConfig;
