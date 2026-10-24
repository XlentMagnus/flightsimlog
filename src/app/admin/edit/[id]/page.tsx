import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getFlight } from "@/lib/flights";
import { FlightForm } from "../../flight-form";

export const dynamic = "force-dynamic";

export default async function EditFlightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const flight = await getFlight(numericId);
  if (!flight) notFound();

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Redigera flygning</h1>
      <FlightForm flight={flight} />
    </div>
  );
}
