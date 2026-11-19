"use client";

import { useCallback, useEffect, useState } from "react";

type LocationData = { name: string; latitude: number | null; longitude: number | null; accuracy: number | null; updatedAt: string; expiresAt: string | null };

export default function SharedLocationPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState("");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const load = useCallback(async (value: string) => {
    try {
      const response = await fetch(`/api/location/${value}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Localização indisponível."); setLocation(null); return; }
      setError(""); setLocation(data);
    } catch { setError("Não foi possível atualizar a localização."); }
  }, []);

  useEffect(() => { params.then(({ token: value }) => setToken(value)); }, [params]);
  useEffect(() => { if (!token) return; load(token); const poll = setInterval(() => load(token), 5000); const clock = setInterval(() => setNow(Date.now()), 1000); return () => { clearInterval(poll); clearInterval(clock); }; }, [token, load]);

  const map = location?.latitude != null && location.longitude != null
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.006}%2C${location.latitude - 0.004}%2C${location.longitude + 0.006}%2C${location.latitude + 0.004}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}` : "";
  const age = location ? Math.max(0, Math.floor((now - new Date(location.updatedAt).getTime()) / 1000)) : 0;

  return <main style={{ minHeight: "100vh", background: "#f5f6fb", padding: 20, fontFamily: "Arial,sans-serif", color: "#101a52" }}>
    <section style={{ maxWidth: 680, margin: "30px auto", background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px #101a5212" }}>
      <div style={{ color: "#e8508a", fontWeight: 800, letterSpacing: 1 }}>ELO SEGURO</div>
      <h1 style={{ fontSize: 26, margin: "12px 0 6px" }}>Localização compartilhada</h1>
      {error ? <p role="alert" style={{ background: "#fff1f2", color: "#9f1239", padding: 14, borderRadius: 10 }}>{error}</p> : <>
        <p style={{ color: "#596079", marginBottom: 18 }}>{location?.name || "Carregando"} está compartilhando a localização em tempo real.</p>
        {map ? <iframe title="Localização em tempo real" src={map} width="100%" height="380" style={{ border: 0, borderRadius: 14 }} loading="lazy" /> : <div style={{ padding: 35, background: "#f1f1fb", borderRadius: 12, textAlign: "center" }}>Aguardando a primeira localização…</div>}
        {location?.latitude != null && location.longitude != null && <div style={{ marginTop: 14, color: "#596079", fontSize: 14 }}>
          <p>Latitude: {location.latitude.toFixed(6)} · Longitude: {location.longitude.toFixed(6)}</p>
          {location.accuracy != null && <p>Precisão aproximada: {Math.round(location.accuracy)} m</p>}
          <p>Última atualização: {age < 5 ? "agora" : `há ${age} segundos`}</p>
          <a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 12, color: "#e8508a", fontWeight: 700 }}>Abrir no Google Maps</a>
        </div>}
        <p style={{ fontSize: 12, color: "#7b8196", marginTop: 20 }}>Esta página atualiza automaticamente a cada 5 segundos. A localização só é atualizada enquanto o compartilhamento estiver ativo no dispositivo da pessoa.</p>
      </>}
    </section>
  </main>;
}
