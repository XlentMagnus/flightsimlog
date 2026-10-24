"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      <input
        type="password"
        name="password"
        placeholder="Losenord"
        autoComplete="current-password"
        required
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
      />
      {state?.error ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium hover:bg-sky-500 disabled:opacity-50"
      >
        {pending ? "Loggar in..." : "Logga in"}
      </button>
    </form>
  );
}
