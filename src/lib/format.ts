export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

/** Snitthastighet i knop (distans / tid). Null om tiden ar noll. */
export function averageSpeedKt(
  distanceNm: number,
  flightTimeMinutes: number,
): number | null {
  if (flightTimeMinutes <= 0) return null;
  return Math.round(distanceNm / (flightTimeMinutes / 60));
}
