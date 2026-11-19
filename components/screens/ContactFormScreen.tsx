"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { maskPhone, onlyDigits } from "@/lib/format";
import { Shell, Field } from "../ui";

const PARENTESCOS = ["Mãe", "Pai", "Irmã(o)", "Companheiro(a)", "Amigo(a)", "Outro"];

export default function ContactFormScreen({ id, onBack }: { id?: string; onBack: () => void }) {
  const { contacts, addContact, updateContact, showToast } = useStore();
  const existing = contacts.find((c) => c.id === id);

  const [nome, setNome] = useState(existing?.nome ?? "");
  const [telefone, setTelefone] = useState(existing?.telefone ?? "");
  const [parentesco, setParentesco] = useState(existing?.parentesco ?? "Mãe");
  const [errs, setErrs] = useState<{ nome?: string; telefone?: string }>({});

  const salvar = () => {
    const e: typeof errs = {};
    if (nome.trim().length < 2) e.nome = "Informe o nome";
    if (onlyDigits(telefone).length < 10) e.telefone = "Informe um telefone com DDD";
    setErrs(e);
    if (Object.keys(e).length) return;

    const payload = { nome: nome.trim(), telefone, parentesco };
    if (existing) {
      updateContact(existing.id, payload);
      showToast("Contato atualizado");
    } else {
      addContact(payload);
      showToast("Contato adicionado");
    }
    onBack();
  };

  return (
    <Shell title={existing ? "Editar contato" : "Novo contato"} onBack={onBack}>
      <div className="card form">
        <Field label="Nome" error={errs.nome}>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Maria Souza" />
        </Field>
        <Field label="Telefone" error={errs.telefone}>
          <input
            value={telefone}
            inputMode="tel"
            onChange={(e) => setTelefone(maskPhone(e.target.value))}
            placeholder="(11) 99999-9999"
          />
        </Field>
        <Field label="Parentesco">
          <select value={parentesco} onChange={(e) => setParentesco(e.target.value)}>
            {PARENTESCOS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <button className="btn-primary" onClick={salvar}>
        Salvar
      </button>
      <button className="btn-ghost" onClick={onBack}>
        Cancelar
      </button>
    </Shell>
  );
}
