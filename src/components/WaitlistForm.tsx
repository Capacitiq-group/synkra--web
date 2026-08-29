import { useState } from "react";
import { joinWaitlist } from "@/lib/public.functions";

export default function WaitlistForm({ product }: { product: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await joinWaitlist({ data: { email: email.trim(), product } });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="body-sm mt-6 text-[var(--color-brand-green)]">
        You are on the list. We will be in touch the moment it is ready.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-brand-green)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary justify-center whitespace-nowrap disabled:opacity-60"
      >
        {state === "sending" ? "Adding..." : "Join waitlist"}
      </button>
      {state === "error" && (
        <p className="body-sm text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
