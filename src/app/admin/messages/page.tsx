import { createClient } from "@/lib/supabase/server";
import { MessageActions } from "./actions-client";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted">
          Contact form submissions.{" "}
          {unreadCount > 0 && (
            <span className="font-medium text-amber-700">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-6 ${
                msg.read
                  ? "border-border bg-background"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {msg.subject}
                    </h3>
                    {!msg.read && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    From <span className="font-medium">{msg.name}</span> &lt;
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-primary hover:text-primary-hover"
                    >
                      {msg.email}
                    </a>
                    &gt; &middot;{" "}
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                    {msg.message}
                  </p>
                </div>
                <MessageActions messageId={msg.id} isRead={msg.read} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-background px-6 py-16 text-center">
            <p className="text-lg text-muted">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
