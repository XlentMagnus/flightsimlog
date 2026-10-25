import Link from "next/link";
import { buildRoutes } from "@/lib/airports";
import { computeStats, formatDuration, listFlights } from "@/lib/flights";
import { SIMULATORS } from "@/lib/validation";
import { FlightMap } from "./flight-map";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sim?: string }>;
}) {
  const { sim } = await searchParams;
  const all = await listFlights();
  const filter = SIMULATORS.find((s) => s === sim);
  const rows = filter ? all.filter((f) => f.simulator === filter) : all;
  const stats = computeStats(rows);
  const { routes, missing } = buildRoutes(rows);

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-10 sm:px-3">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Flightlog</h1>
          <p className="text-slate-400">Min flyghistorik i MSFS</p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Admin
        </Link>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Flygningar" value={String(stats.count)} />
        <Stat label="Flygtid" value={formatDuration(stats.totalMinutes)} />
        <Stat label="Distans" value={`${stats.totalNm.toLocaleString("sv-SE")} nm`} />
        <Stat label="Flygplatser" value={String(stats.airports)} />
      </section>

      <section className="mb-8">
        <FlightMap routes={routes} />
        {missing.length > 0 ? (
          <p className="mt-2 text-xs text-slate-500">
            Saknar koordinater for: {missing.join(", ")}
          </p>
        ) : null}
      </section>

      <nav className="mb-4 flex gap-2 text-sm">
        <FilterLink href="/" active={!filter}>
          Alla
        </FilterLink>
        {SIMULATORS.map((s) => (
          <FilterLink
            key={s}
            href={`/?sim=${encodeURIComponent(s)}`}
            active={filter === s}
          >
            {s}
          </FilterLink>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-slate-800 p-8 text-center text-slate-400">
          Inga flygningar loggade an.
        </p>
      ) : (
        <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
          {rows.map((f) => (
            <li key={f.id} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-lg">
                  {f.departureIcao} <span className="text-slate-500">→</span>{" "}
                  {f.arrivalIcao}
                </p>
                <p className="text-sm text-slate-400">{f.flightDate}</p>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                {f.aircraft} · {f.simulator} · {formatDuration(f.flightTimeMinutes)} ·{" "}
                {f.distanceNm.toLocaleString("sv-SE")} nm
                {f.rating ? ` · ${"★".repeat(f.rating)}` : ""}
              </p>
              {f.notes ? (
                <p className="mt-2 whitespace-pre-line text-sm text-slate-400">
                  {f.notes}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-xl">{value}</p>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 ${
        active
          ? "border-sky-500 bg-sky-500/10 text-sky-300"
          : "border-slate-700 text-slate-400 hover:text-slate-200"
      }`}
    >
      {children}
    </Link>
  );
}
