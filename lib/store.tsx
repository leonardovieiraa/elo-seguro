"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------ Tipos ------------------------------ */
export type Contact = { id: string; nome: string; telefone: string; parentesco: string };

export type AlertRecord = {
  id: string;
  data: string; // ISO
  origem: "app" | "pulseira";
  lat?: number;
  lng?: number;
  precisao?: number;
  contatos: string[]; // nomes
  mensagem: string;
};

export type Settings = {
  vibracao: boolean;
  som: boolean;
  contagem: 0 | 3 | 5 | 10;
  incluirLocalizacao: boolean;
  mensagem: string;
};

export type Profile = {
  nome: string;
  telefone: string;
  tipoSanguineo: string;
  alergias: string;
  observacoes: string;
};

export type Notif = { id: string; texto: string; data: string; lida: boolean };

export type Sharing = {
  ativo: boolean;
  ate: number | null; // timestamp ms, null = até desligar
  lat?: number;
  lng?: number;
  atualizadoEm?: number;
  token?: string;
  url?: string;
};

export type Modelo = "Adulto" | "Infantil";

type Data = {
  contacts: Contact[];
  alerts: AlertRecord[];
  settings: Settings;
  profile: Profile;
  modelo: Modelo;
  connected: boolean;
  battery: number;
  sharing: Sharing;
  notifs: Notif[];
};

export type Position = { lat: number; lng: number; precisao?: number };

/* --------------------------- Utilitários --------------------------- */
export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export function getPosition(timeout = 12000): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      reject(new Error("A localização só pode ser acessada pelo navegador."));
      return;
    }
    if (!window.isSecureContext) {
      reject(new Error("O navegador bloqueou o GPS porque o site não está em HTTPS. Abra o Elo Seguro por um endereço HTTPS ou use localhost durante o desenvolvimento."));
      return;
    }
    if (!navigator.geolocation) {
      reject(new Error("Este navegador não oferece suporte à localização. Atualize ou use Chrome, Edge ou Safari."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, precisao: p.coords.accuracy }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Permissão de localização bloqueada. Clique no cadeado ao lado do endereço do site, abra Permissões do site > Localização, selecione Permitir e recarregue a página."));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error("O dispositivo não conseguiu determinar sua posição. Ative a localização/GPS do aparelho e tente novamente."));
        } else if (error.code === error.TIMEOUT) {
          reject(new Error("O GPS demorou para responder. Ative a localização do aparelho e tente novamente em um local com melhor sinal."));
        } else {
          reject(new Error("Não foi possível acessar a localização. Verifique as permissões do navegador e do aparelho."));
        }
      },
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    );
  });
}

export function beep(times = 3) {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    for (let i = 0; i < times; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = i % 2 ? 660 : 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.25);
      o.stop(ctx.currentTime + i * 0.25 + 0.18);
    }
  } catch {
    /* sem áudio */
  }
}

export const mapsLink = (lat: number, lng: number) => `https://maps.google.com/?q=${lat},${lng}`;

/* --------------------------- Dados iniciais --------------------------- */
const daysAgo = (d: number, h = 0) => new Date(Date.now() - d * 86400000 - h * 3600000).toISOString();

const initial = (): Data => ({
  contacts: [],
  alerts: [],
  settings: {
    vibracao: true,
    som: true,
    contagem: 5,
    incluirLocalizacao: true,
    mensagem: "Preciso de ajuda! Este é um alerta do Elo Seguro.",
  },
  profile: {
    nome: "",
    telefone: "",
    tipoSanguineo: "",
    alergias: "",
    observacoes: "",
  },
  modelo: "Adulto",
  connected: false,
  battery: 0,
  sharing: { ativo: false, ate: null },
  notifs: [],
});



/* ------------------------------ Contexto ------------------------------ */
type Ctx = Data & {
  ready: boolean;
  connecting: boolean;
  toast: string | null;
  showToast: (msg: string) => void;
  unread: number;
  addContact: (c: Omit<Contact, "id">) => void;
  updateContact: (id: string, c: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
  saveSettings: (s: Partial<Settings>) => void;
  saveProfile: (p: Partial<Profile>) => void;
  setModelo: (m: Modelo) => void;
  toggleConnection: () => void;
  startSharing: (minutos: number | null) => Promise<boolean>;
  stopSharing: () => void;
  refreshSharing: () => Promise<void>;
  sendAlert: (origem: "app" | "pulseira") => Promise<AlertRecord>;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  markAllRead: () => void;
  addNotif: (texto: string) => void;
  resetAll: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore fora do StoreProvider");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(initial);
  const [ready, setReady] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);


  // Carrega os dados privados do usuário autenticado no PostgreSQL.
  useEffect(() => {
    let active = true;
    fetch("/api/data", { cache: "no-store" })
      .then(async (r) => { if (!r.ok) throw new Error("Não foi possível carregar seus dados."); return r.json(); })
      .then(({ data: saved }) => { if (active && saved) setData({ ...initial(), ...saved }); })
      .catch((error) => { console.error(error); if (active) showToast("Não foi possível sincronizar seus dados."); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [showToast]);

  // Persiste alterações no banco com pequeno debounce para evitar várias gravações seguidas.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      fetch("/api/data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) })
        .then((r) => { if (!r.ok) throw new Error("Falha ao salvar dados."); })
        .catch((error) => { console.error(error); showToast("Não foi possível salvar no servidor."); });
    }, 450);
    return () => clearTimeout(timer);
  }, [data, ready, showToast]);

  const addNotif = useCallback((texto: string) => {
    setData((d) => ({
      ...d,
      notifs: [{ id: uid(), texto, data: new Date().toISOString(), lida: false }, ...d.notifs].slice(0, 50),
    }));
  }, []);

  // compartilhamento expira sozinho
  useEffect(() => {
    const t = setInterval(() => {
      setData((d) =>
        d.sharing.ativo && d.sharing.ate && Date.now() > d.sharing.ate
          ? {
              ...d,
              sharing: { ativo: false, ate: null },
              notifs: [
                { id: uid(), texto: "O compartilhamento de localização terminou.", data: new Date().toISOString(), lida: false },
                ...d.notifs,
              ],
            }
          : d
      );
    }, 10000);
    return () => clearInterval(t);
  }, []);

  const value = useMemo<Ctx>(() => {
    return {
      ...data,
      ready,
      connecting,
      toast,
      showToast,
      unread: data.notifs.filter((n) => !n.lida).length,

      addContact: (c) => setData((d) => ({ ...d, contacts: [...d.contacts, { id: uid(), ...c }] })),
      updateContact: (id, c) =>
        setData((d) => ({ ...d, contacts: d.contacts.map((x) => (x.id === id ? { id, ...c } : x)) })),
      removeContact: (id) => setData((d) => ({ ...d, contacts: d.contacts.filter((x) => x.id !== id) })),

      saveSettings: (s) => setData((d) => ({ ...d, settings: { ...d.settings, ...s } })),
      saveProfile: (p) => setData((d) => ({ ...d, profile: { ...d.profile, ...p } })),
      setModelo: (m) => setData((d) => ({ ...d, modelo: m })),

      toggleConnection: () => {
        if (connecting) return;
        setConnecting(true);
        setTimeout(() => {
          setData((d) => ({ ...d, connected: !d.connected }));
          setConnecting(false);
        }, 1400);
      },

      startSharing: async (minutos) => {
        let pos: Position;
        try {
          // Esta chamada acontece diretamente após o clique do usuário e aciona
          // o pedido nativo de permissão do navegador quando o estado é "prompt".
          pos = await getPosition();
        } catch (error) {
          showToast(error instanceof Error ? error.message : "Não foi possível obter sua localização.");
          return false;
        }
        try {
          const created = await fetch("/api/location/share", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ minutes: minutos }),
          });
          const share = await created.json();
          if (!created.ok) throw new Error(share.error || "Não foi possível criar o link.");
          const saved = await fetch("/api/location/share", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: share.token, latitude: pos.lat, longitude: pos.lng, accuracy: pos.precisao }),
          });
          if (!saved.ok) throw new Error("Não foi possível publicar a localização.");
          setData((d) => ({ ...d, sharing: {
            ativo: true, ate: share.expiresAt ? new Date(share.expiresAt).getTime() : null,
            lat: pos.lat, lng: pos.lng, atualizadoEm: Date.now(), token: share.token,
            url: `${window.location.origin}${share.url}`,
          } }));
          return true;
        } catch (error) {
          console.error(error); showToast(error instanceof Error ? error.message : "Falha ao iniciar compartilhamento.");
          return false;
        }
      },
      stopSharing: () => {
        const token = data.sharing.token;
        if (token) fetch("/api/location/share", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }).catch(console.error);
        setData((d) => ({ ...d, sharing: { ativo: false, ate: null } }));
      },
      refreshSharing: async () => {
        const pos = await getPosition(8000).catch(() => null);
        if (!pos) return;
        const current = data.sharing;
        if (!current.ativo || !current.token) return;
        try {
          const response = await fetch("/api/location/share", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: current.token, latitude: pos.lat, longitude: pos.lng, accuracy: pos.precisao }),
          });
          if (!response.ok) { showToast("O link de localização expirou ou foi encerrado."); setData((d) => ({ ...d, sharing: { ativo: false, ate: null } })); return; }
          setData((d) => d.sharing.ativo && d.sharing.token === current.token
            ? { ...d, sharing: { ...d.sharing, lat: pos.lat, lng: pos.lng, atualizadoEm: Date.now() } } : d);
        } catch (error) { console.error(error); }
      },

      sendAlert: async (origem) => {
        const pos = data.settings.incluirLocalizacao ? await getPosition(4000).catch(() => null) : null;
        const rec: AlertRecord = {
          id: uid(),
          data: new Date().toISOString(),
          origem,
          lat: pos?.lat,
          lng: pos?.lng,
          precisao: pos?.precisao,
          contatos: data.contacts.map((c) => c.nome),
          mensagem: data.settings.mensagem,
        };
        if (data.settings.vibracao && "vibrate" in navigator) navigator.vibrate([300, 150, 300, 150, 300]);
        if (data.settings.som) beep();
        setData((d) => ({
          ...d,
          alerts: [rec, ...d.alerts],
          notifs: [
            {
              id: uid(),
              texto: `Alerta enviado para ${rec.contatos.length} contato(s).`,
              data: rec.data,
              lida: false,
            },
            ...d.notifs,
          ],
        }));
        return rec;
      },
      removeAlert: (id) => setData((d) => ({ ...d, alerts: d.alerts.filter((a) => a.id !== id) })),
      clearAlerts: () => setData((d) => ({ ...d, alerts: [] })),
      markAllRead: () => setData((d) => ({ ...d, notifs: d.notifs.map((n) => ({ ...n, lida: true })) })),
      addNotif,
      resetAll: () => setData(initial()),
    };
  }, [data, ready, connecting, toast, showToast, addNotif]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
