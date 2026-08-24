import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── GET /auth/callback ───────────────────────────────────────────
// Where Supabase sends people after they click a link in an email
// (password recovery, and email confirmation if it is ever switched on).
//
// Supabase appends a one-time `code`. Exchanging it here sets the session
// cookies, which is what lets /reset-password change the password.
//
// The `next` parameter says where to send them afterwards. It is only ever
// honoured as a same-site path, so this cannot be used as an open redirect.

export const runtime = "nodejs";

function safeNext(value) {
  if (typeof value !== "string") return "/";
  // Must start with a single slash: "/reset-password" yes, "//evil.com" no.
  return /^\/(?!\/)[\w\-./?=&%]*$/.test(value) ? value : "/";
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // Supabase reports its own failures here — an expired or reused link.
  const errorDescription =
    searchParams.get("error_description") || searchParams.get("error");

  if (errorDescription) {
    const url = new URL(next === "/" ? "/sign-in" : next, origin);
    url.searchParams.set("error", errorDescription);
    return NextResponse.redirect(url);
  }

  if (!code) {
    const url = new URL("/sign-in", origin);
    url.searchParams.set("error", "That link is missing its security code.");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Code exchange failed:", error.message);

    const url = new URL(next === "/" ? "/sign-in" : next, origin);
    url.searchParams.set(
      "error",
      "That link has expired or has already been used. Please request a new one."
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL(next, origin));
}
