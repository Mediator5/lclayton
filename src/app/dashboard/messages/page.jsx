"use client";

import { PortalShell } from "@/app/components/portal-ui";
import { MessageThread } from "@/app/components/message-thread";

export default function ClientMessagesPage() {
  return (
    <PortalShell
      eyebrow="Client Portal"
      title="Messages"
      intro="Talk to Latravia directly. Everything stays inside your portal rather than scattered across email."
      wide
    >
      <MessageThread
        viewerRole="client"
        title="Your conversation"
        emptyHint="No messages yet. Send the first one — a question about your return, a document you are unsure about, anything at all."
      />

      <p className="font-body text-slate-400 text-xs mt-6 leading-relaxed">
        Please do not send account numbers or Social Security numbers in a
        message. Upload documents containing them in the Documents section
        instead, where they are stored privately and every access is recorded.
      </p>
    </PortalShell>
  );
}
