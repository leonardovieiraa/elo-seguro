"use client";

import { useEffect, useState } from "react";
import { useStore, mapsLink } from "@/lib/store";
import { waLink, osmEmbed } from "@/lib/format";
import { Shell } from "../ui";

const DURACOES: { label: string; min: number | null }[] = [
  { label: "15 min", min: 15 },
  { label: "1 hora", min: 60 },
  { label: "8 horas", min: 480 },
  { label: "Até desligar", min: null },
];

export default function LocationScreen({ onBack }: { onBack: () => void }) {
  const { sharing, contacts, startSharing, stopSharing, refreshSharing, showToast, profile, addNotif } = useStore();
  const [dur, setDur] = useState<number | null>(60);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  // atualiza posição a cada 15s enquanto ativo + relógio do tempo restante
  useEffect(() => {
    if (!sharing.ativo) return;
    const a = setInterval(() => refreshSharing(), 5000);
    const b = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [sharing.ativo, refreshSharing]);

  const restante = sharing.ate ? Math.max(0, sharing.ate - now) : null;
  const fmtRest = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h ? `${h}h ${m}min` : `${m}min ${s % 60}s`;
  };

  const link = sharing.url || (sharing.lat != null && sharing.lng != null ? mapsLink(sharing.lat, sharing.lng) : "");
  const texto = `${profile.nome} está compartilhando a localização em tempo real com você pelo Elo Seguro: ${link}`;

  const ligar = async () => {
    setLoading(true);
    const ok = await startSharing(dur);
    setLoading(false);
    if (ok) {
      showToast("Localização compartilhada");
      addNotif("Você começou a compartilhar sua localização.");
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copiado");
    } catch {
      showToast("Não foi possível copiar");
    }
  };

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Minha localização", text: texto, url: link });
      } catch {
        /* cancelado */
      }
    } else copiar();
  };

  return (
    <Shell title="Compartilhar Localização" onBack={onBack}>
      <div className="card status-card">
        <span className={`dot ${sharing.ativo ? "" : "off"}`} />
        <div>
          <strong>{sharing.ativo ? "Compartilhando agora" : "Compartilhamento desligado"}</strong>
          <small>
            {sharing.ativo
              ? restante != null
                ? `Termina em ${fmtRest(restante)}`
                : "Até você desligar"
              : "Seus contatos não veem onde você está."}
          </small>
        </div>
      </div>

      {sharing.ativo && sharing.lat != null && sharing.lng != null ? (
        <>
          <div className="map-wrap">
            <iframe title="Mapa" src={osmEmbed(sharing.lat, sharing.lng)} loading="lazy" />
          </div>
          <p className="hint small">Link privado para acompanhar em tempo real:</p>
          <div className="card" style={{ padding: 12, overflowWrap: "anywhere", fontSize: 13 }}>{link}</div>
          <p className="hint small">
            {sharing.lat.toFixed(5)}, {sharing.lng.toFixed(5)}
            {sharing.atualizadoEm && ` · atualizado às ${new Date(sharing.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
          </p>

          <div className="row-btns">
            <button className="btn-light" onClick={copiar}>
              Copiar link
            </button>
            <button className="btn-light" onClick={compartilhar}>
              Compartilhar
            </button>
          </div>

          <h3 className="sec">Enviar para um contato</h3>
          <ul className="list">
            {contacts.map((c) => (
              <li key={c.id} className="card item compact">
                <div className="item-main">
                  <strong>{c.nome}</strong>
                  <span>{c.telefone}</span>
                </div>
                <a className="pill-link" href={waLink(c.telefone, texto)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            ))}
            {contacts.length === 0 && <p className="hint">Nenhum contato cadastrado.</p>}
          </ul>

          <button className="btn-danger" onClick={() => { stopSharing(); showToast("Compartilhamento encerrado"); }}>
            Parar de compartilhar
          </button>
        </>
      ) : (
        <>
          <h3 className="sec">Por quanto tempo?</h3>
          <div className="chips">
            {DURACOES.map((d) => (
              <button key={d.label} className={`chip ${dur === d.min ? "on" : ""}`} onClick={() => setDur(d.min)}>
                {d.label}
              </button>
            ))}
          </div>
          <p className="hint small">Ao tocar no botão, o navegador deve abrir a solicitação de acesso ao GPS. O endereço precisa estar em HTTPS (ou localhost durante testes).</p>
          <button className="btn-primary" disabled={loading} onClick={ligar}>
            {loading ? "Obtendo localização..." : "Começar a compartilhar"}
          </button>
        </>
      )}
    </Shell>
  );
}
