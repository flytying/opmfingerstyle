"use client";

import { useRouter } from "next/navigation";
import { toggleRead, deleteMessage } from "./actions";

export function MessageActions({ messageId, isRead }: { messageId: string; isRead: boolean }) {
  const router = useRouter();

  async function handleToggleRead() {
    await toggleRead(messageId, !isRead);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(messageId);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={handleToggleRead}
        className="text-sm font-medium text-primary hover:text-primary-hover"
      >
        {isRead ? "Mark Unread" : "Mark Read"}
      </button>
      <button
        onClick={handleDelete}
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </div>
  );
}
