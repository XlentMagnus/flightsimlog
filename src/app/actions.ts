"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { flights } from "@/db/schema";
import {
  checkPassword,
  createSession,
  destroySession,
  isAdmin,
} from "@/lib/auth";
import { flightSchema } from "@/lib/validation";

export type FormState = { error?: string } | undefined;

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Fel losenord." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}

function parseFlight(formData: FormData) {
  const parsed = flightSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter." };
  }
  const { hours, minutes, ...rest } = parsed.data;
  const flightTimeMinutes = hours * 60 + minutes;
  if (flightTimeMinutes === 0) {
    return { error: "Flygtiden kan inte vara noll." };
  }
  return { data: { ...rest, flightTimeMinutes } };
}

export async function saveFlight(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) redirect("/admin/login");

  const result = parseFlight(formData);
  if ("error" in result) return { error: result.error };

  const idRaw = formData.get("id");
  if (idRaw) {
    await getDb()
      .update(flights)
      .set(result.data)
      .where(eq(flights.id, Number(idRaw)));
  } else {
    await getDb().insert(flights).values(result.data);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteFlight(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await getDb().delete(flights).where(eq(flights.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}
