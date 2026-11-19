"use client";

import { useStore, mapsLink } from "@/lib/store";
import { fmtDate, osmEmbed } from "@/lib/format";
import { Shell } from "../ui";

export default function AlertDetailScreen({ id, onBack }: { id: string; onBack: () => void }) {
  const { alerts, removeAlert, showToast } = useStore();
  const a = alerts.find((x) => x.id === id);

  if (!a)
    return (
      <Shell title="Alerta" onBack={onBack}>
        <div className="empty">
          <p>Alerta não encontrado.</p>
        </div>
      </Shell>
    );

  return (
    <Shell title="Detalhes do alerta" onBack={onBack}>
      <div className="card group">
        <div className="kv">
          <span>Data</span>
          <b>{fmtDate(a.data)}</b>
        </div>
        <div className="kv">
          <span>Origem</span>
          <b>{a.origem === "pulseira" ? "Botão da pulseira" : "Botão do app"}</b>
        </div>
        <div className="kv">
          <span>Mensagem</span>
          <b>{a.mensagem}</b>
        </div>
      </div>

      <h3 className="sec">Contatos avisados</h3>
      <div className="card group">
        {a.contatos.length ? a.contatos.map((n) => <div key={n} className="kv"><b>✔ {n}</b></div>) : <p className="hint">Nenhum contato.</p>}
      </div>

      <h3 className="sec">Localização</h3>
      {a.lat != null && a.lng != null ? (
        <>
          <div className="map-wrap">
            <iframe title="Mapa do alerta" src={osmEmbed(a.lat, a.lng)} loading="lazy" />
          </div>
          <a className="btn-light as-link" href={mapsLink(a.lat, a.lng)} target="_blank" rel="noreferrer">
            Abrir no Google Maps
          </a>
        </>
      ) : (
        <p className="hint">Este alerta foi enviado sem localização.</p>
      )}

      <button
        className="btn-danger"
        onClick={() => {
          if (confirm("Excluir este alerta do histórico?")) {
            removeAlert(a.id);
            showToast("Alerta excluído");
            onBack();
          }
        }}
      >
        Excluir alerta
      </button>
    </Shell>
  );
}
