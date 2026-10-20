import type { SeasonHero, SeasonKey, SiteSettings } from "@/types";
import { seasonHeroes } from "@/lib/mock/seasons";

/**
 * Month → season (1-indexed months).
 * Heat: Sep–Nov
 * Storms: Dec–Apr (Dec wins over heat when overlapping)
 * Outages: May–Aug
 */
export function seasonFromDate(date: Date = new Date()): SeasonKey {
  const month = date.getMonth() + 1;

  if (month >= 12 || month <= 4) return "storms";
  if (month >= 5 && month <= 8) return "outages";
  return "heat";
}

export function resolveSeason(
  settings: SiteSettings,
  date: Date = new Date(),
): SeasonKey {
  return settings.activeSeason ?? seasonFromDate(date);
}

export function getSeasonHero(
  settings: SiteSettings,
  date: Date = new Date(),
): SeasonHero {
  const key = resolveSeason(settings, date);
  return seasonHeroes[key];
}
