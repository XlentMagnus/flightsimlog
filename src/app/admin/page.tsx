import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteFlight, logout } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
import { formatDuration, listFlights } from "@/lib/flights";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const rows = await listFlights();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-slate-400 hover:text-slate-200">
            Visa sidan
          </Link>
          <form action={logout}>
            <button className="text-slate-400 hover:text-slate-200">
              Logga ut
            </button>
          </form>
        </div>
      </header>

      <Link
        href="/admin/new"
        className="mb-6 inline-block rounded-md bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500"
      >
        Ny flygning
      </Link>

      <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
        {rows.map((f) => (
          <li key={f.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-mono">
                {f.departureIcao} → {f.arrivalIcao}
              </p>
              <p className="text-sm text-slate-400">
                {f.flightDate} · {f.aircraft} · {formatDuration(f.flightTimeMinutes)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href={`/admin/edit/${f.id}`}
                className="text-sky-400 hover:text-sky-300"
              >
                Redigera
              </Link>
              <form action={deleteFlight}>
                <input type="hidden" name="id" value={f.id} />
                <button className="text-red-400 hover:text-red-300">
                  Ta bort
                </button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="p-6 text-center text-slate-400">Inga flygningar an.</li>
        ) : null}
      </ul>
    </div>
  );
}
