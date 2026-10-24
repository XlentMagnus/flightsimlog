import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { FlightForm } from "../flight-form";

export const dynamic = "force-dynamic";

export default async function NewFlightPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Ny flygning</h1>
      <FlightForm />
    </div>
  );
}
