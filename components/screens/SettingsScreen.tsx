"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Shell, Toggle, Field } from "../ui";

export default function SettingsScreen({
  onBack,
  onBraceletButton,
}: {
  onBack: () => void;
  onBraceletButton: () => void;
}) {
  const {
    settings,
    saveSettings,
    connected,
    connecting,
    battery,
    toggleConnection,
    modelo,
    setModelo,
    clearAlerts,
    resetAll,
    showToast,
  } = useStore();
  const [msg, setMsg] = useState(settings.mensagem);

  return (
    <Shell title="Configurações" onBack={onBack}>
      <h3 className="sec">Pulseira</h3>
      <div className="card group">
        <div className="toggle-row">
          <div>
            <div className="t-label">{connecting ? "Conectando..." : connected ? "Conectada" : "Desconectada"}</div>
            <div className="t-desc">Bateria: {connected ? `${battery}%` : "--"}</div>
          </div>
          <button className="btn-small" disabled={connecting} onClick={toggleConnection}>
            {connected ? "Desconectar" : "Conectar"}
          </button>
        </div>
        <Field label="Modelo">
          <select value={modelo} onChange={(e) => setModelo(e.target.value as "Adulto" | "Infantil")}>
            <option>Adulto</option>
            <option>Infantil</option>
          </select>
        </Field>
        <button
          className="btn-light"
          disabled={!connected}
          onClick={onBraceletButton}
          title={connected ? "" : "Conecte a pulseira primeiro"}
        >
          Simular botão da pulseira
        </button>
      </div>

      <h3 className="sec">Alerta</h3>
      <div className="card group">
        <Field label="Contagem antes de enviar">
          <select
            value={settings.contagem}
            onChange={(e) => saveSettings({ contagem: Number(e.target.value) as 0 | 3 | 5 | 10 })}
          >
            <option value={0}>Enviar na hora</option>
            <option value={3}>3 segundos</option>
            <option value={5}>5 segundos</option>
            <option value={10}>10 segundos</option>
          </select>
        </Field>
        <Toggle label="Incluir localização" desc="Anexa onde você está ao alerta" checked={settings.incluirLocalizacao} onChange={(v) => saveSettings({ incluirLocalizacao: v })} />
        <Toggle label="Vibração" checked={settings.vibracao} onChange={(v) => saveSettings({ vibracao: v })} />
        <Toggle label="Som" checked={settings.som} onChange={(v) => saveSettings({ som: v })} />
        <Field label="Mensagem do alerta">
          <textarea
            rows={3}
            value={msg}
            maxLength={160}
            onChange={(e) => setMsg(e.target.value)}
            onBlur={() => saveSettings({ mensagem: msg.trim() || "Preciso de ajuda!" })}
          />
        </Field>
      </div>

      <h3 className="sec">Dados</h3>
      <div className="card group">
        <button
          className="btn-light"
          onClick={() => {
            if (confirm("Apagar todo o histórico de alertas?")) {
              clearAlerts();
              showToast("Histórico apagado");
            }
          }}
        >
          Limpar histórico de alertas
        </button>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm("Restaurar todos os dados para o padrão?")) {
              resetAll();
              setMsg("Preciso de ajuda! Este é um alerta do Elo Seguro.");
              showToast("Dados restaurados");
            }
          }}
        >
          Restaurar dados de exemplo
        </button>
      </div>
      <p className="hint small center">Elo Seguro v0.2 · dados salvos neste navegador</p>
    </Shell>
  );
}
