"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { greatCircle, type LatLon } from "@/lib/geo";

type Airport = { icao: string; name: string; lat: number; lon: number };
type Route = { key: string; from: Airport; to: Airport; count: number };

const ROUTE_COLOR = "#3b82f6";

export function FlightMap({ routes }: { routes: Route[] }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      if (disposed) return;

      const map = L.map(el, { worldCopyJump: true, zoomSnap: 0.5 });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const bounds: LatLon[] = [];
      const airports = new Map<string, Airport>();

      for (const r of routes) {
        const points = greatCircle([r.from.lat, r.from.lon], [r.to.lat, r.to.lon]);
        bounds.push(...points);
        L.polyline(points, {
          color: ROUTE_COLOR,
          weight: Math.min(2 + (r.count - 1) * 0.75, 6),
          opacity: 0.8,
        })
          .bindTooltip(
            `${r.from.icao} ↔ ${r.to.icao} · ${r.count} ${
              r.count === 1 ? "flygning" : "flygningar"
            }`,
            { sticky: true },
          )
          .addTo(map);
        airports.set(r.from.icao, r.from);
        airports.set(r.to.icao, r.to);
      }

      for (const a of airports.values()) {
        L.circleMarker([a.lat, a.lon], {
          radius: 4,
          color: "#1e3a8a",
          weight: 1,
          fillColor: ROUTE_COLOR,
          fillOpacity: 1,
        })
          .bindTooltip(`${a.icao} · ${a.name}`)
          .addTo(map);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });
      } else {
        map.setView([30, 10], 2);
      }

      cleanup = () => map.remove();
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [routes]);

  return (
    <div
      ref={container}
      role="img"
      aria-label="Karta over flygrutter"
      className="isolate h-[55vh] min-h-[420px] max-h-[720px] w-full overflow-hidden rounded-lg border border-slate-800"
    />
  );
}
