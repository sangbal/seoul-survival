import { SeasonState } from "../domain/types";

/**
 * Returns the total number of events for the season.
 * Guarantees a non-zero, positive integer to prevent division by zero errors.
 *
 * Logic:
 * 1. If season.eventsPlanned is valid (>0), use it.
 * 2. Fallback to 12 (default season length).
 */
export function getSeasonTotalEvents(season: SeasonState | undefined): number {
  if (!season) return 12;

  // Use eventsPlanned if it exists and is positive
  if (season.eventsPlanned && season.eventsPlanned > 0) {
    return season.eventsPlanned;
  }

  // Safe fallback
  return 12;
}

/**
 * Calculates the season completion progress percentage (0-100).
 * Safe against NaN/Infinity.
 */
export function getSeasonProgress(season: SeasonState | undefined): number {
  if (!season) return 0;
  const completed = season.eventsCompleted || 0;
  const total = getSeasonTotalEvents(season);

  const pct = (completed / total) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/**
 * Determines if the season is finished.
 * Only returns true if we have actually completed the total required events.
 */
export function isSeasonFinished(season: SeasonState | undefined): boolean {
  if (!season) return false;
  const total = getSeasonTotalEvents(season);
  return season.eventsCompleted >= total;
}
