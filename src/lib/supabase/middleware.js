import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// ─── Session refresh helper for middleware ────────────────────────
// Supabase access tokens are short-lived. This creates a client bound to
// the incoming request's cookies and writes any refreshed tokens onto the
// outgoing response, so the session stays alive across navigations.
//
// Returns { supabase, response }. Whoever calls this MUST return the
// response object (or copy its cookies onto whatever it returns instead),
// otherwise refreshed tokens are lost and users get logged out at random.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createMiddlewareClient(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return {
    supabase,
    // Read the current response lazily — setAll may have replaced it.
    get response() {
      return response;
    },
  };
}

// Copy the refreshed auth cookies from `from` onto a redirect response,
// so a redirect never throws away a token refresh.
export function withAuthCookies(target, from) {
  from.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}
