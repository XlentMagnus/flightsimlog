import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-20">
      <h1 className="mb-6 text-2xl font-semibold">Logga in</h1>
      <LoginForm />
    </div>
  );
}
