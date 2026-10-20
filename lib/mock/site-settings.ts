import type { SeasonKey, SiteSettings } from "@/types";

const VALID: SeasonKey[] = ["heat", "storms", "outages"];

function parseForceSeason(): SeasonKey | null {
  const raw = process.env.NEXT_PUBLIC_FORCE_SEASON?.trim().toLowerCase();
  if (!raw) return null;
  return VALID.includes(raw as SeasonKey) ? (raw as SeasonKey) : null;
}

/**
 * Mock admin / site_settings singleton.
 * Set `activeSeason` (or NEXT_PUBLIC_FORCE_SEASON) to force a hero.
 * Leave null to derive from the current date.
 */
export const siteSettings: SiteSettings = {
  activeSeason: parseForceSeason(),
};
