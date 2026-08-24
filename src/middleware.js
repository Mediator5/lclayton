import { NextResponse } from "next/server";
import {
  createMiddlewareClient,
  withAuthCookies,
} from "@/lib/supabase/middleware";

// ─── Route groups ─────────────────────────────────────────────────

// Public marketing pages and the public API. These skip the auth check
// entirely, so a visitor browsing the site never waits on Supabase.
const PUBLIC_PREFIXES = [
  "/about",
  "/services",
  "/who-we-serve",
  "/blog",
  "/contact",
  "/value",
  "/process",
  "/api/contact",
];

// Signed-in users should not see these.
const AUTH_PAGES = ["/sign-in", "/sign-up"];

const isPublic = (pathname) =>
  pathname === "/" ||
  PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

const isAuthPage = (pathname) => AUTH_PAGES.includes(pathname);
const isAdminRoute = (pathname) => pathname.startsWith("/admin");
const isDashboardRoute = (pathname) => pathname.startsWith("/dashboard");
const isPendingPage = (pathname) => pathname === "/pending";

// ─── Middleware ───────────────────────────────────────────────────

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Public pages pass straight through — no Supabase call, no latency.
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 2. Everything below needs to know who the visitor is.
  const { supabase, response } = createMiddlewareClient(request);

  // getUser() revalidates the token with Supabase. Do NOT swap this for
  // getSession(), which trusts whatever is in the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirect = (to) =>
    withAuthCookies(NextResponse.redirect(new URL(to, request.url)), response);

  // 3. Already signed in? Keep them off sign-in / sign-up.
  if (isAuthPage(pathname)) {
    return user ? redirect("/dashboard") : response;
  }

  // 4. Not signed in.
  if (!user) {
    // API routes answer with JSON, not a redirect to an HTML page.
    if (pathname.startsWith("/api/")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return withAuthCookies(NextResponse.redirect(signInUrl), response);
  }

  // API routes do their own role checks in the handler (requireAdmin), so
  // once we know who they are, let them through.
  if (pathname.startsWith("/api/")) {
    return response;
  }

  // 5. Look up role + status. RLS lets a user read their own row.
  const { data: profile } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const status = profile?.status;

  // 6. The pending screen is for anyone not yet approved. An approved
  //    user landing there gets moved along to where they belong.
  if (isPendingPage(pathname)) {
    if (status === "approved") {
      return redirect(role === "admin" ? "/admin" : "/dashboard");
    }
    return response;
  }

  // 7. Admin area — admins only.
  if (isAdminRoute(pathname)) {
    if (role !== "admin") {
      return redirect(status === "approved" ? "/dashboard" : "/pending");
    }
    return response;
  }

  // 8. Client dashboard — approved clients only.
  if (isDashboardRoute(pathname)) {
    if (status !== "approved") {
      return redirect("/pending");
    }
    return response;
  }

  return response;
}

// ─── Matcher ──────────────────────────────────────────────────────
// Skip Next internals and static assets.

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
