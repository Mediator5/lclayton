import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─── Define protected route groups ───────────────────────────────

const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/services(.*)",
  "/who-we-serve(.*)",
  "/blog(.*)",
  "/contact(.*)",
  "/resources(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pending",
  "/api/webhooks(.*)",   // Clerk webhook must be public
]);

const isAdminRoute     = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

// ─── Middleware logic ─────────────────────────────────────────────

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1. Allow all public routes through with no checks
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Not signed in — redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Admin routes — only allow users with role "admin"
  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role;
    if (role !== "admin") {
      // Signed in but not admin — send to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 4. Dashboard routes — only allow approved clients
  if (isDashboardRoute(req)) {
    const status = sessionClaims?.metadata?.status;
    if (status === "pending" || status === "denied") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }
  }

  return NextResponse.next();
});

// ─── Route matcher config ─────────────────────────────────────────
// Tells Next.js which paths this middleware should run on.
// Excludes static files and Next.js internals.

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};