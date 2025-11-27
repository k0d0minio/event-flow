/**
 * @ef/db - Shared Supabase database connection utilities
 *
 * This package provides unified Supabase client utilities for connecting
 * to the Flow Stage database across all apps in the monorepo.
 *
 * Usage:
 * - Client components: import { createClient } from "@ef/db/client"
 * - Server components: import { createClient } from "@ef/db/server"
 */

export { createClient } from "./client.js";
export { createClient as createServerClient } from "./server.js";
export type { Database } from "./types.js";
