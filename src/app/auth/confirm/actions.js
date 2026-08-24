"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ─── Verify an emailed auth link ──────────────────────────────────
// A Server Action, which means it only ever runs on POST. That is the
// whole point: email scanners and link prefetchers issue GET requests,
// so they can no longer burn the one-time token before the real person
// clicks. The token is spent only when a human presses the button.

function safeNext(value) {
  if (typeof value !== "string") return "/";
  // A single leading slash only: "/reset-password" yes, "//evil.com" no.
  return /^\/(?!\/)[\w\-./?=&%]*$/.test(value) ? value : "/";
}

const VALID_TYPES = [
  "recovery",
  "signup",
  "invite",
  "magiclink",
  "email_change",
];

export async function verifyEmailLink(formData) {
  const tokenHash = formData.get("token_hash");
  const rawType = formData.get("type");
  const next = safeNext(formData.get("next"));

  const type = VALID_TYPES.includes(rawType) ? rawType : "recovery";

  if (!tokenHash) {
    redirect(
      `/sign-in?error=${encodeURIComponent(
        "That link is missing its security token. Please request a new one."
      )}`
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  // NOTE: redirect() works by throwing, so it must sit outside any
  // try/catch that would swallow it.
  if (error) {
    console.error("[auth/confirm] verifyOtp failed:", error.message);

    const target = next === "/" ? "/sign-in" : next;
    redirect(
      `${target}?error=${encodeURIComponent(
        "That link has expired or has already been used. Please request a new one."
      )}`
    );
  }

  // Verified — the session cookies are set, so the destination page can
  // now act on behalf of this user.
  redirect(next);
}
