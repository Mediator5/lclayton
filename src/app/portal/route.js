import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// ─── GET /portal ──────────────────────────────────────────────────
// "Take me to my portal." Works out where that is and redirects.
//
// This exists so the header does not have to know about roles. It links
// to /portal unconditionally and the right destination is decided here,
// on the server, from the database — an admin never lands on the client
// dashboard and a pending client never slips past the waiting room.

export const runtime = "nodejs";

export async function GET(request) {
  const { origin } = new URL(request.url);

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  if (user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  if (user.status === "approved") {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return NextResponse.redirect(new URL("/pending", origin));
}
