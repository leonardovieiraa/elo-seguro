"use client";

import { useStore } from "@/lib/store";
import { fmtRelative } from "@/lib/format";
import { Shell } from "../ui";

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const { notifs, markAllRead, unread } = useStore();

  return (
    <Shell
      title="Notificações"
      onBack={onBack}
      right={
        unread > 0 ? (
          <button className="icon-btn" aria-label="Marcar todas como lidas" onClick={markAllRead}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 13 4 4L14 8M12 16l2 2L22 8" />
            </svg>
          </button>
        ) : null
      }
    >
      {notifs.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">🔔</div>
          <p>Sem notificações.</p>
        </div>
      ) : (
        <ul className="list">
          {notifs.map((n) => (
            <li key={n.id} className={`card item compact ${n.lida ? "read" : ""}`}>
              {!n.lida && <i className="unread-dot" />}
              <div className="item-main">
                <strong style={{ fontWeight: n.lida ? 500 : 600 }}>{n.texto}</strong>
                <span>{fmtRelative(n.data)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
