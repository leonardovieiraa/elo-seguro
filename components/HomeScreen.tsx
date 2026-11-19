"use client";

import { useState } from "react";
import Logo from "./Logo";
import Bracelet from "./Bracelet";
import {
  BellIcon,
  HeartOutline,
  BatteryIcon,
  UsersIcon,
  PinIcon,
  GearIcon,
  DocIcon,
  WarningIcon,
  ChevronDown,
} from "./Icons";
import { TabBar, Tab } from "./ui";

export type HomeTarget = "contacts" | "location" | "settings" | "history";

type Props = {
  nome?: string;
  unread?: number;
  connected?: boolean;
  connecting?: boolean;
  battery?: number;
  modelo?: string;
  sharing?: boolean;
  onModelo?: (m: "Adulto" | "Infantil") => void;
  onBell?: () => void;
  onPill?: () => void;
  onTile?: (t: HomeTarget) => void;
  onAlert?: () => void;
  tab?: Tab;
  onTab?: (t: Tab) => void;
};

export default function HomeScreen({
  nome = "Giovana",
  unread = 0,
  connected = true,
  connecting = false,
  battery = 85,
  modelo,
  sharing = false,
  onModelo,
  onBell,
  onPill,
  onTile,
  onAlert,
  tab = "home",
  onTab,
}: Props) {
  const [localModelo, setLocalModelo] = useState("Adulto");
  const m = modelo ?? localModelo;

  return (
    <div className="phone-screen home">
      <div className="scroll">
        <header className="home-header">
          <div className="brand-sm">
            <Logo size={44} />
            <span>
              Elo <span className="accent">Seguro</span>
            </span>
          </div>
          <button aria-label="Notificações" className="bell" onClick={onBell}>
            <BellIcon />
            {unread > 0 && <b className="badge">{unread > 9 ? "9+" : unread}</b>}
          </button>
        </header>

        <section className="greeting">
          <div>
            <h2>Olá, {nome}!</h2>
            <p>Sua segurança em um só lugar.</p>
          </div>
          <span style={{ color: "var(--pink-300)" }}>
            <HeartOutline />
          </span>
        </section>

        <button className="status-pill" onClick={onPill} aria-label="Alternar conexão da pulseira">
          <span className="left">
            <span className={`dot ${connecting ? "wait" : connected ? "" : "off"}`} />
            {connecting ? "Conectando..." : connected ? "Pulseira conectada" : "Pulseira desconectada"}
          </span>
          <span className="battery">
            <BatteryIcon size={26} />
            {connected ? `${battery}%` : "--"}
          </span>
        </button>

        <div className="bracelet-card" style={{ opacity: connected ? 1 : 0.6 }}>
          <Bracelet width={250} />
          <label className="model-label">
            Modelo:
            <select
              className="model-select"
              value={m}
              onChange={(e) => {
                const v = e.target.value as "Adulto" | "Infantil";
                setLocalModelo(v);
                onModelo?.(v);
              }}
            >
              <option>Adulto</option>
              <option>Infantil</option>
            </select>
            <ChevronDown />
          </label>
        </div>

        <div className="grid">
          <button className="tile" onClick={() => onTile?.("contacts")}>
            <UsersIcon />
            <span>
              Contatos de
              <br />
              Emergência
            </span>
          </button>
          <button className="tile" onClick={() => onTile?.("location")}>
            {sharing && <i className="live-dot" />}
            <PinIcon />
            <span>
              Compartilhar
              <br />
              Localização
            </span>
          </button>
          <button className="tile" onClick={() => onTile?.("settings")}>
            <GearIcon />
            <span>Configurações</span>
          </button>
          <button className="tile" onClick={() => onTile?.("history")}>
            <DocIcon />
            <span>
              Histórico
              <br />
              de Alertas
            </span>
          </button>
        </div>

        <button className="alert-btn" onClick={onAlert}>
          <WarningIcon size={32} />
          Botão de Alerta
        </button>
      </div>

      <TabBar tab={tab} onTab={onTab} />
    </div>
  );
}
