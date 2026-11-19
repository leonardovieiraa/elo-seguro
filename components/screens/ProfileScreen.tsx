"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { initials, maskPhone } from "@/lib/format";
import { Shell, Field, Tab } from "../ui";

const SANGUE = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfileScreen({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const { profile, saveProfile, contacts, alerts, showToast } = useStore();
  const [f, setF] = useState(profile);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const mudou = JSON.stringify(f) !== JSON.stringify(profile);

  return (
    <Shell title="Meu Perfil" tab={tab} onTab={onTab}>
      <div className="profile-head">
        <div className="avatar big">{initials(f.nome) || "?"}</div>
        <div>
          <strong>{f.nome || "Sem nome"}</strong>
          <span>
            {contacts.length} contato(s) · {alerts.length} alerta(s)
          </span>
        </div>
      </div>

      <div className="card form">
        <Field label="Nome">
          <input value={f.nome} onChange={(e) => set("nome", e.target.value)} />
        </Field>
        <Field label="Telefone">
          <input value={f.telefone} inputMode="tel" onChange={(e) => set("telefone", maskPhone(e.target.value))} />
        </Field>
        <Field label="Tipo sanguíneo">
          <select value={f.tipoSanguineo} onChange={(e) => set("tipoSanguineo", e.target.value)}>
            {SANGUE.map((s) => (
              <option key={s} value={s}>
                {s || "Não informado"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Alergias">
          <input value={f.alergias} onChange={(e) => set("alergias", e.target.value)} placeholder="Ex.: dipirona, amendoim" />
        </Field>
        <Field label="Observações médicas">
          <textarea rows={3} value={f.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
        </Field>
      </div>

      <button
        className="btn-primary"
        disabled={!mudou}
        onClick={() => {
          if (f.nome.trim().length < 2) return showToast("Informe seu nome");
          saveProfile({ ...f, nome: f.nome.trim() });
          showToast("Perfil salvo");
        }}
      >
        Salvar alterações
      </button>
    </Shell>
  );
}
