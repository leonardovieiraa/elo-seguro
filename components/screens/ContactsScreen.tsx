"use client";

import { useStore } from "@/lib/store";
import { initials, waLink, onlyDigits } from "@/lib/format";
import { Shell } from "../ui";

export default function ContactsScreen({
  onBack,
  onAdd,
  onEdit,
}: {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}) {
  const { contacts, removeContact, showToast, settings, profile } = useStore();

  const testMsg = `Olá! Esta é uma mensagem de teste do Elo Seguro enviada por ${profile.nome}.`;

  return (
    <Shell title="Contatos de Emergência" onBack={onBack}>
      <p className="hint">Estas pessoas serão avisadas quando você acionar o alerta. Máximo de 5 contatos.</p>

      {contacts.length === 0 && (
        <div className="empty">
          <div className="empty-ico">👥</div>
          <p>Nenhum contato cadastrado ainda.</p>
        </div>
      )}

      <ul className="list">
        {contacts.map((c) => (
          <li key={c.id} className="card item">
            <div className="avatar">{initials(c.nome)}</div>
            <div className="item-main">
              <strong>{c.nome}</strong>
              <span>
                {c.parentesco} · {c.telefone}
              </span>
              <div className="item-actions">
                <a href={`tel:+55${onlyDigits(c.telefone)}`}>Ligar</a>
                <a href={waLink(c.telefone, testMsg)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <button onClick={() => onEdit(c.id)}>Editar</button>
                <button
                  className="danger"
                  onClick={() => {
                    if (confirm(`Remover ${c.nome}?`)) {
                      removeContact(c.id);
                      showToast("Contato removido");
                    }
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="btn-primary"
        onClick={() => {
          if (contacts.length >= 5) return showToast("Limite de 5 contatos atingido");
          onAdd();
        }}
      >
        + Adicionar contato
      </button>
      {settings.mensagem && (
        <p className="hint small">
          Mensagem enviada: “{settings.mensagem}”
        </p>
      )}
    </Shell>
  );
}
