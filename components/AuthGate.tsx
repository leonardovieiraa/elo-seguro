"use client";
import { FormEvent, useEffect, useState } from "react";
import Logo from "./Logo";

type User = { id: string; name: string; email: string };
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/auth/me").then(async r => r.ok ? (await r.json()).user : null).then(setUser).catch(() => setUser(null)).finally(() => setChecking(false)); }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const payload = await r.json(); if (!r.ok) throw new Error(payload.error || "Não foi possível entrar."); setUser(payload.user);
    } catch (err) { setError(err instanceof Error ? err.message : "Erro de conexão."); } finally { setBusy(false); }
  }
  if (checking) return <div className="auth-wrap"><div className="auth-card">Carregando Elo Seguro...</div></div>;
  if (user) return <><button className="auth-logout" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});setUser(null);}}>Sair</button>{children}</>;
  return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <div className="auth-logo"><Logo size={76}/></div><h1>{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1><p>Seu cuidado, sempre conectado.</p>
    {mode === "register" && <label>Nome completo<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" /></label>}
    <label>E-mail<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" /></label>
    <label>Senha<input required type="password" minLength={mode === "register" ? 8 : 1} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode === "register" ? "Mínimo de 8 caracteres" : "Sua senha"} /></label>
    {error && <div className="auth-error">{error}</div>}
    <button disabled={busy} type="submit">{busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
    <div className="auth-switch">{mode === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"} <button type="button" onClick={()=>{setMode(mode === "login" ? "register" : "login");setError("")}}>{mode === "login" ? "Cadastre-se" : "Fazer login"}</button></div>
  </form></div>;
}
