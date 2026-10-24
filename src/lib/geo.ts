export type LatLon = [number, number];

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/**
 * Punkter langs storcirkeln mellan a och b. Longituderna "packas upp" sa att
 * linjen ar kontinuerlig over datumgransen (kan ge longitud utanfor +-180,
 * vilket Leaflet hanterar).
 */
export function greatCircle(a: LatLon, b: LatLon): LatLon[] {
  const [lat1, lon1] = [toRad(a[0]), toRad(a[1])];
  const [lat2, lon2] = [toRad(b[0]), toRad(b[1])];

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );

  if (d < 1e-6) return [a, b];

  const steps = Math.min(128, Math.max(2, Math.ceil(toDeg(d) * 2)));
  const points: LatLon[] = [];

  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    points.push([
      toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
      toDeg(Math.atan2(y, x)),
    ]);
  }

  // Packa upp longituder sa att ingen punkt hoppar mer an 180 grader.
  for (let i = 1; i < points.length; i++) {
    while (points[i][1] - points[i - 1][1] > 180) points[i][1] -= 360;
    while (points[i][1] - points[i - 1][1] < -180) points[i][1] += 360;
  }

  return points;
}
