"use client";

import { useEffect, useRef, useState } from "react";
import { averageSpeedKt, formatDuration } from "@/lib/format";

export type FlightRow = {
  id: number;
  flightDate: string;
  departureIcao: string;
  arrivalIcao: string;
  aircraft: string;
  simulator: string;
  flightTimeMinutes: number;
  distanceNm: number;
  rating: number | null;
  addon: string | null;
  route: string | null;
  notes: string | null;
};

type ImageResult = { imageUrl: string; pageUrl: string; title: string } | null;

const imageCache = new Map<string, Promise<ImageResult>>();

function loadImage(name: string): Promise<ImageResult> {
  const key = name.trim().toLowerCase();
  let hit = imageCache.get(key);
  if (!hit) {
    hit = fetch(`/api/aircraft-image?name=${encodeURIComponent(name)}`)
      .then((r) => (r.ok ? r.json() : { image: null }))
      .then((j: { image: ImageResult }) => j.image ?? null)
      .catch(() => null);
    imageCache.set(key, hit);
  }
  return hit;
}

export function FlightList({ flights }: { flights: FlightRow[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<FlightRow | null>(null);

  function open(f: FlightRow) {
    setSelected(f);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
        {flights.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => open(f)}
              className="block w-full p-4 text-left hover:bg-slate-900/60 focus-visible:bg-slate-900/60 focus-visible:outline-none"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-lg">
                  {f.departureIcao} <span className="text-slate-500">→</span>{" "}
                  {f.arrivalIcao}
                </p>
                <p className="text-sm text-slate-400">{f.flightDate}</p>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                {f.aircraft}
                {f.addon ? ` (${f.addon})` : ""} · {f.simulator} ·{" "}
                {formatDuration(f.flightTimeMinutes)} ·{" "}
                {f.distanceNm.toLocaleString("sv-SE")} nm
                {f.rating ? ` · ${"★".repeat(f.rating)}` : ""}
              </p>
              {f.notes ? (
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {f.notes}
                </p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onClose={() => setSelected(null)}
        aria-label="Flyginformation"
        className="m-auto w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-0 text-slate-100 backdrop:bg-black/70"
      >
        {selected ? <FlightDetails flight={selected} onClose={close} /> : null}
      </dialog>
    </>
  );
}

function FlightDetails({
  flight: f,
  onClose,
}: {
  flight: FlightRow;
  onClose: () => void;
}) {
  const speed = averageSpeedKt(f.distanceNm, f.flightTimeMinutes);

  return (
    <div className="max-h-[92vh] overflow-y-auto">
      <AircraftImage key={f.aircraft} name={f.aircraft} />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-3xl sm:text-4xl">
              {f.departureIcao} <span className="text-slate-500">→</span>{" "}
              {f.arrivalIcao}
            </h2>
            <p className="mt-1 text-base text-slate-400">{f.flightDate}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 px-4 py-2 text-base text-slate-300 hover:text-white"
          >
            Stäng
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-lg sm:grid-cols-3">
          <Item label="Flygplan" value={f.aircraft} />
          {f.addon ? <Item label="Tillägg" value={f.addon} /> : null}
          <Item label="Simulator" value={f.simulator} />
          <Item label="Flygtid" value={formatDuration(f.flightTimeMinutes)} />
          <Item
            label="Distans"
            value={`${f.distanceNm.toLocaleString("sv-SE")} nm`}
          />
          <Item
            label="Snitthastighet"
            value={speed === null ? "-" : `ca ${speed} kt`}
          />
          <Item
            label="Betyg"
            value={f.rating ? "★".repeat(f.rating) : "Inget betyg"}
          />
        </dl>

        {f.route ? (
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Route
            </p>
            <p className="mt-1.5 break-words font-mono text-base text-slate-200">
              {f.route}
            </p>
          </div>
        ) : null}

        {f.notes ? (
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Anteckningar
            </p>
            <p className="mt-1.5 whitespace-pre-line text-base leading-relaxed text-slate-300">
              {f.notes}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-100">{value}</dd>
    </div>
  );
}

function AircraftImage({ name }: { name: string }) {
  const [state, setState] = useState<
    { status: "loading" } | { status: "done"; image: ImageResult }
  >({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadImage(name).then((image) => {
      if (!cancelled) setState({ status: "done", image });
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (state.status === "loading") {
    return <div className="aspect-video w-full animate-pulse bg-slate-800" aria-hidden />;
  }

  if (!state.image) {
    return (
      <div className="flex h-40 items-center justify-center bg-slate-800 text-base text-slate-500">
        Ingen bild hittades
      </div>
    );
  }

  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.image.imageUrl}
        alt={`${name} (bild från Wikipedia)`}
        className="aspect-video w-full bg-slate-800 object-cover"
      />
      <figcaption className="bg-slate-950 px-6 py-2 text-sm text-slate-500 sm:px-8">
        Bild via{" "}
        <a
          href={state.image.pageUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-300"
        >
          Wikipedia: {state.image.title}
        </a>
        . Kan visa en annan variant än din.
      </figcaption>
    </figure>
  );
}
