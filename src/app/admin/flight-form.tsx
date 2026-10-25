"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveFlight } from "@/app/actions";
import type { Flight } from "@/db/schema";
import { AIRCRAFT, findAircraft } from "@/lib/aircraft";
import { SIMULATORS } from "@/lib/validation";

const input =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2";
const label = "mb-1 block text-sm text-slate-400";

export function FlightForm({ flight }: { flight?: Flight }) {
  const [state, action, pending] = useActionState(saveFlight, undefined);
  const today = new Date().toISOString().slice(0, 10);
  const [aircraft, setAircraft] = useState(flight?.aircraft ?? "");
  const notInList = aircraft.trim().length > 0 && !findAircraft(aircraft);

  return (
    <form action={action} className="space-y-4">
      {flight ? <input type="hidden" name="id" value={flight.id} /> : null}

      <div>
        <label className={label} htmlFor="flightDate">Datum</label>
        <input
          id="flightDate"
          type="date"
          name="flightDate"
          defaultValue={flight?.flightDate ?? today}
          required
          className={input}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="departureIcao">Avgang (ICAO)</label>
          <input
            id="departureIcao"
            name="departureIcao"
            defaultValue={flight?.departureIcao}
            maxLength={4}
            placeholder="ESSA"
            required
            className={`${input} font-mono uppercase`}
          />
        </div>
        <div>
          <label className={label} htmlFor="arrivalIcao">Destination (ICAO)</label>
          <input
            id="arrivalIcao"
            name="arrivalIcao"
            defaultValue={flight?.arrivalIcao}
            maxLength={4}
            placeholder="ENGM"
            required
            className={`${input} font-mono uppercase`}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="aircraft">Flygplan</label>
        <input
          id="aircraft"
          name="aircraft"
          list="aircraft-list"
          value={aircraft}
          onChange={(e) => setAircraft(e.target.value)}
          placeholder="Borja skriva, t.ex. Airbus A330-300"
          autoComplete="off"
          maxLength={80}
          required
          className={input}
        />
        <datalist id="aircraft-list">
          {AIRCRAFT.map((a) => (
            <option key={a.name} value={a.name} />
          ))}
        </datalist>
        {notInList ? (
          <p className="mt-1 text-xs text-amber-400">
            Finns inte i flygplanslistan. Flygningen sparas anda, men bilden
            blir en gissning fran Wikipedia.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="addon">Tillagg/utvecklare (valfritt)</label>
          <input
            id="addon"
            name="addon"
            defaultValue={flight?.addon ?? ""}
            placeholder="t.ex. Fenix, FlyByWire, PMDG"
            maxLength={80}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="simulator">Simulator</label>
          <select
            id="simulator"
            name="simulator"
            defaultValue={flight?.simulator ?? "MSFS 2024"}
            className={input}
          >
            {SIMULATORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={label} htmlFor="hours">Timmar</label>
          <input
            id="hours"
            type="number"
            name="hours"
            min={0}
            max={99}
            defaultValue={flight ? Math.floor(flight.flightTimeMinutes / 60) : 0}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="minutes">Minuter</label>
          <input
            id="minutes"
            type="number"
            name="minutes"
            min={0}
            max={59}
            defaultValue={flight ? flight.flightTimeMinutes % 60 : 0}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="distanceNm">Distans (nm)</label>
          <input
            id="distanceNm"
            type="number"
            name="distanceNm"
            min={0}
            defaultValue={flight?.distanceNm ?? 0}
            required
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="rating">Betyg (1-5, valfritt)</label>
        <select
          id="rating"
          name="rating"
          defaultValue={flight?.rating ?? ""}
          className={input}
        >
          <option value="">Inget betyg</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{"★".repeat(n)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="route">Route (valfritt)</label>
        <input
          id="route"
          name="route"
          defaultValue={flight?.route ?? ""}
          placeholder="t.ex. SID, waypoints eller airways, STAR"
          maxLength={500}
          className={`${input} font-mono`}
        />
      </div>

      <div>
        <label className={label} htmlFor="notes">Anteckningar</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={flight?.notes ?? ""}
          className={input}
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 disabled:opacity-50"
        >
          {pending ? "Sparar..." : "Spara"}
        </button>
        <Link
          href="/admin"
          className="rounded-md border border-slate-700 px-4 py-2 text-slate-300 hover:text-white"
        >
          Avbryt
        </Link>
      </div>
    </form>
  );
}
