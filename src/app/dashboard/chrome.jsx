"use client";

import { PortalShell } from "@/app/components/portal-ui";

// A thin client wrapper so the server-rendered dashboard can still use the
// shared portal shell (which needs usePathname and the sign-out button).

export function DashboardChrome({ firstName, children }) {
  return (
    <PortalShell
      eyebrow="Client Portal"
      title={`Welcome${firstName ? `, ${firstName}` : ""}.`}
      intro="Your appointments, your documents, and everything the firm has prepared for you."
      wide
    >
      {children}
    </PortalShell>
  );
}
