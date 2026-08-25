"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Notice, PrimaryButton } from "@/app/components/portal-ui";

// ─── A conversation ───────────────────────────────────────────────
// Used by both sides. `viewerRole` decides which bubbles sit on the
// right, and nothing else differs — the firm and the client see the
// same conversation.
//
// Messages refresh on a timer, but only while the tab is visible, so a
// portal left open in a background tab is not quietly polling all day.

const POLL_MS = 20000;

// Quick starters for the requests Latravia sends most often.
const ADMIN_TEMPLATES = [
  {
    label: "Request a document",
    body: "Hello — could you please upload the following to the Documents section of your portal when you have a moment?\n\n• ",
  },
  {
    label: "Missing information",
    body: "Hello — I need a little more information before I can continue:\n\n• ",
  },
  {
    label: "Work is ready",
    body: "Hello — your documents are ready and waiting in the Documents section of your portal. Please review them and let me know if anything looks wrong.",
  },
];

function formatStamp(value) {
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();

  return sameDay
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function dayLabel(value) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function MessageThread({
  viewerRole, // "admin" | "client"
  clientId = null, // required when viewerRole is "admin"
  title,
  emptyHint,
  onUnreadCleared,
}) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const scrollBox = useRef(null);
  const shouldStickToBottom = useRef(true);

  const endpoint = clientId
    ? `/api/messages?clientId=${clientId}`
    : "/api/messages";

  // ── Load ─────────────────────────────────────────────────────────
  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!quiet) setLoading(true);

      try {
        const res = await fetch(endpoint);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (!quiet) setError(data.error || "Could not load messages.");
          return;
        }

        setMessages(data.messages ?? []);
        setError("");
      } catch {
        if (!quiet) setError("Could not reach the server.");
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [endpoint]
  );

  // ── Mark the other side's messages as read ───────────────────────
  const markRead = useCallback(async () => {
    try {
      await fetch("/api/messages/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      onUnreadCleared?.();
    } catch {
      /* a badge that lingers is not worth an error */
    }
  }, [clientId, onUnreadCleared]);

  useEffect(() => {
    load().then(markRead);
  }, [load, markRead]);

  // Poll, but only while the tab is actually being looked at.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") load({ quiet: true });
    };

    const timer = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load]);

  // Keep the newest message in view — unless the reader has scrolled up
  // to read something older, in which case leave them where they are.
  useEffect(() => {
    const box = scrollBox.current;
    if (box && shouldStickToBottom.current) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const box = scrollBox.current;
    if (!box) return;
    const distanceFromBottom =
      box.scrollHeight - box.scrollTop - box.clientHeight;
    shouldStickToBottom.current = distanceFromBottom < 80;
  };

  // ── Send ─────────────────────────────────────────────────────────
  const send = async (event) => {
    event?.preventDefault();

    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setError("");
    shouldStickToBottom.current = true;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, clientId }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not send that.");
        return;
      }

      setDraft("");
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setError("Could not reach the server. Your message was not sent.");
    } finally {
      setSending(false);
    }
  };

  // Enter sends, Shift+Enter makes a new line.
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  // ── Group by day ─────────────────────────────────────────────────
  const groups = [];
  for (const message of messages) {
    const label = dayLabel(message.created_at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(message);
    else groups.push({ label, items: [message] });
  }

  return (
    <Card title={title} className="!p-0 overflow-hidden">
      {error && (
        <div className="px-6 pt-5">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {/* Transcript */}
      <div
        ref={scrollBox}
        onScroll={handleScroll}
        className="h-[26rem] overflow-y-auto px-5 sm:px-6 py-6 bg-slate-50/60 border-y border-slate-100"
      >
        {loading ? (
          <p className="font-body text-slate-400 text-sm text-center py-16">
            Loading conversation…
          </p>
        ) : messages.length === 0 ? (
          <p className="font-body text-slate-400 text-sm text-center py-16 max-w-sm mx-auto leading-relaxed">
            {emptyHint}
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-px bg-slate-200 flex-1" />
                  <span className="font-body text-slate-400 text-[10px] uppercase tracking-widest">
                    {group.label}
                  </span>
                  <span className="h-px bg-slate-200 flex-1" />
                </div>

                {group.items.map((message) => {
                  const mine = message.sender_role === viewerRole;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[85%] sm:max-w-[70%]">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            mine
                              ? "bg-navy text-white rounded-br-sm"
                              : "bg-white border border-slate-200 text-navy rounded-bl-sm"
                          }`}
                        >
                          <p className="font-body text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.body}
                          </p>
                        </div>

                        <p
                          className={`font-body text-slate-400 text-[10px] mt-1.5 ${
                            mine ? "text-right" : "text-left"
                          }`}
                        >
                          {mine
                            ? "You"
                            : viewerRole === "admin"
                              ? "Client"
                              : "L Clayton Services"}{" "}
                          · {formatStamp(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={send} className="p-5 sm:p-6">
        {viewerRole === "admin" && (
          <div className="flex flex-wrap gap-2 mb-3">
            {ADMIN_TEMPLATES.map((template) => (
              <button
                key={template.label}
                type="button"
                onClick={() => setDraft(template.body)}
                className="font-body text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full
                           border border-slate-200 text-slate-500 hover:border-gold/50
                           hover:text-navy transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              viewerRole === "admin"
                ? "Write to your client…"
                : "Write to L Clayton Services…"
            }
            className="flex-1 font-body text-sm bg-white border border-slate-200 rounded-xl
                       px-4 py-3 text-navy placeholder-slate-400 outline-none resize-none
                       transition-all duration-200 focus:border-gold/60 focus:ring-2 focus:ring-gold/10"
          />

          <PrimaryButton type="submit" disabled={sending || !draft.trim()}>
            {sending ? "Sending…" : "Send"}
          </PrimaryButton>
        </div>

        <p className="font-body text-slate-400 text-xs mt-2.5">
          Enter to send · Shift + Enter for a new line. The other side is
          notified by email.
        </p>
      </form>
    </Card>
  );
}
