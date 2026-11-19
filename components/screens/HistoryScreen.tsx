"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate, fmtRelative } from "@/lib/format";
import { Shell, Tab } from "../ui";

export default function HistoryScreen({
  onBack,
  onOpen,
  tab,
  onTab,
}: {
  onBack?: () => void;
  onOpen: (id: string) => void;
  tab?: Tab;
  onTab?: (t: Tab) => void;
}) {
  const { alerts, clearAlerts, showToast } = useStore();
  const [filtro, setFiltro] = useState<"todos" | "app" | "pulseira">("todos");

  const dias = useMemo(() => {
    const out: { label: string; n: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const n = alerts.filter((a) => {
        const t = new Date(a.data).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      out.push({ label: d.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3), n });
    }
    return out;
  }, [alerts]);

  const max = Math.max(1, ...dias.map((d) => d.n));
  const lista = alerts.filter((a) => filtro === "todos" || a.origem === filtro);
  const ult30 = alerts.filter((a) => Date.now() - new Date(a.data).getTime() < 30 * 86400000).length;

  return (
    <Shell
      title="Histórico de Alertas"
      onBack={onBack}
      tab={tab}
      onTab={onTab}
      right={
        alerts.length > 0 ? (
          <button
            className="icon-btn"
            aria-label="Limpar"
            onClick={() => {
              if (confirm("Apagar todo o histórico?")) {
                clearAlerts();
                showToast("Histórico apagado");
              }
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Z" />
            </svg>
          </button>
        ) : null
      }
    >
      <div className="stats">
        <div className="card stat">
          <b>{alerts.length}</b>
          <span>alertas no total</span>
        </div>
        <div className="card stat">
          <b>{ult30}</b>
          <span>últimos 30 dias</span>
        </div>
      </div>

      <div className="card chart">
        <div className="chart-title">Últimos 7 dias</div>
        <div className="bars">
          {dias.map((d, i) => (
            <div key={i} className="bar-col">
              <span className="bar-n">{d.n || ""}</span>
              <div className="bar" style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 6 : 2 }} />
              <span className="bar-l">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chips">
        {(["todos", "app", "pulseira"] as const).map((f) => (
          <button key={f} className={`chip ${filtro === f ? "on" : ""}`} onClick={() => setFiltro(f)}>
            {f === "todos" ? "Todos" : f === "app" ? "Pelo app" : "Pela pulseira"}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">🛡️</div>
          <p>Nenhum alerta por aqui. Que bom!</p>
        </div>
      ) : (
        <ul className="list">
          {lista.map((a) => (
            <li key={a.id}>
              <button className="card item hist" onClick={() => onOpen(a.id)}>
                <div className={`avatar ${a.origem === "pulseira" ? "alt" : ""}`}>{a.origem === "pulseira" ? "⌚" : "📱"}</div>
                <div className="item-main">
                  <strong>{a.origem === "pulseira" ? "Alerta pela pulseira" : "Alerta pelo app"}</strong>
                  <span>
                    {fmtDate(a.data)} · {fmtRelative(a.data)}
                  </span>
                  <span>
                    {a.contatos.length} contato(s) · {a.lat != null ? "com localização" : "sem localização"}
                  </span>
                </div>
                <span className="chev">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
