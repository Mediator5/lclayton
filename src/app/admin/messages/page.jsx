"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PortalShell,
  Card,
  Notice,
  EmptyState,
} from "@/app/components/portal-ui";
import { MessageThread } from "@/app/components/message-thread";

// ─── Admin inbox ──────────────────────────────────────────────────
// A list of client conversations on the left, the open thread on the
// right. Anyone waiting on a reply sorts to the top.

function timeAgo(value) {
  if (!value) return "";

  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/threads");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not load the inbox.");
        return;
      }

      setThreads(data.threads ?? []);
      setError("");

      // Open the first conversation on arrival, so the page is not empty.
      setSelected((current) => current ?? data.threads?.[0]?.client ?? null);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <PortalShell
      admin
      eyebrow="Administration"
      title="Messages"
      intro={
        totalUnread
          ? `${totalUnread} unread message${totalUnread === 1 ? "" : "s"} from clients.`
          : "Ask a client for a document, or answer a question."
      }
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}

      {loading ? (
        <Card>
          <EmptyState>Loading…</EmptyState>
        </Card>
      ) : threads.length === 0 ? (
        <Card>
          <EmptyState>
            No approved clients yet. Approve someone and their conversation
            appears here.
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client list */}
          <div className="lg:col-span-1">
            <Card title="Clients" className="!p-0 overflow-hidden">
              <ul className="flex flex-col divide-y divide-slate-100 max-h-[32rem] overflow-y-auto">
                {threads.map(({ client, unread, lastMessage }) => {
                  const active = selected?.id === client.id;

                  return (
                    <li key={client.id}>
                      <button
                        onClick={() => setSelected(client)}
                        className={`w-full text-left px-5 py-4 transition-colors ${
                          active
                            ? "bg-navy/5 border-l-2 border-gold"
                            : "hover:bg-slate-50 border-l-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-heading text-navy text-sm font-bold truncate flex-1">
                            {client.full_name || client.email}
                          </span>

                          {unread > 0 && (
                            <span className="shrink-0 font-body text-[10px] font-bold bg-gold text-navy-deep rounded-full px-2 py-0.5">
                              {unread}
                            </span>
                          )}
                        </div>

                        <p className="font-body text-slate-400 text-xs truncate">
                          {lastMessage
                            ? `${lastMessage.sender_role === "admin" ? "You: " : ""}${lastMessage.body}`
                            : "No messages yet"}
                        </p>

                        {lastMessage && (
                          <p className="font-body text-slate-300 text-[10px] mt-1">
                            {timeAgo(lastMessage.created_at)}
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2">
            {selected ? (
              <MessageThread
                key={selected.id}
                viewerRole="admin"
                clientId={selected.id}
                title={selected.full_name || selected.email}
                emptyHint={`No messages with ${
                  selected.full_name || "this client"
                } yet. Use a quick starter below, or write your own.`}
                onUnreadCleared={load}
              />
            ) : (
              <Card>
                <EmptyState>Pick a client to open the conversation.</EmptyState>
              </Card>
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}
