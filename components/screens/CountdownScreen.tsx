"use client";

import { useEffect, useRef, useState } from "react";
import { useStore, AlertRecord } from "@/lib/store";

export default function CountdownScreen({
  origem,
  onCancel,
  onDone,
  onAddContacts,
}: {
  origem: "app" | "pulseira";
  onCancel: () => void;
  onDone: (r: AlertRecord) => void;
  onAddContacts: () => void;
}) {
  const { settings, contacts, sendAlert, addNotif, showToast } = useStore();
  const total = settings.contagem;
  const [left, setLeft] = useState<number>(total);
  const [sending, setSending] = useState(false);
  const fired = useRef(false);

  const semContatos = contacts.length === 0;

  const disparar = async () => {
    if (fired.current) return;
    fired.current = true;
    setSending(true);
    const r = await sendAlert(origem);
    onDone(r);
  };

 useEffect(() => {
  if (semContatos) return;

  if (total === 0) {
    disparar();
    return;
  }

  const t = setInterval(() => {
    setLeft((l) => Math.max(0, l - 1));
  }, 1000);

  return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!semContatos && total > 0 && left <= 0) disparar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  if (semContatos) {
    return (
      <div className="phone-screen countdown">
        <div className="cd-inner">
          <div className="empty-ico big">👥</div>
          <h2>Nenhum contato cadastrado</h2>
          <p>Cadastre pelo menos um contato de emergência para poder enviar alertas.</p>
          <button className="btn-primary" onClick={onAddContacts}>
            Cadastrar contato
          </button>
          <button className="btn-ghost" onClick={onCancel}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const R = 70;
  const C = 2 * Math.PI * R;
  const prog = total ? Math.max(0, left) / total : 0;

  return (
    <div className="phone-screen countdown">
      <div className="cd-inner">
        <p className="cd-top">{origem === "pulseira" ? "Botão da pulseira acionado" : "Alerta acionado"}</p>
        <h2>{sending ? "Enviando alerta..." : "Enviando alerta em"}</h2>

        <div className="ring">
          <svg viewBox="0 0 160 160" width="200" height="200">
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
            <circle
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke="#ff5a7a"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - prog)}
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="ring-n">{sending ? "…" : Math.max(0, left)}</span>
        </div>

        <p>Seus {contacts.length} contato(s) serão avisados{settings.incluirLocalizacao ? " com a sua localização" : ""}.</p>

        <button
          className="cancel-btn"
          disabled={sending}
          onClick={() => {
            fired.current = true;
            addNotif("Você cancelou um alerta antes do envio.");
            showToast("Alerta cancelado");
            onCancel();
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
