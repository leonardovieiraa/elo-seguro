import { SirenIcon } from "./Icons";

export default function AlertScreen({
  onOk,
  onDetail,
  semLocalizacao = false,
}: {
  onOk?: () => void;
  onDetail?: () => void;
  semLocalizacao?: boolean;
}) {
  return (
    <div className="phone-screen alert-screen">
      <div className="siren-wrap">
        <span className="pulse p3" />
        <span className="pulse p2" />
        <span className="pulse p1" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <SirenIcon size={170} />
        </div>
      </div>

      <h2>Alerta Enviado!</h2>
      <p>
        {semLocalizacao
          ? "Seus contatos de emergência foram notificados."
          : "Seus contatos de emergência foram notificados e sua localização foi compartilhada."}
      </p>

      {onDetail && (
        <button className="link-btn" onClick={onDetail}>
          Ver detalhes do alerta
        </button>
      )}

      <button className="ok-btn" onClick={onOk}>
        Ok
      </button>
    </div>
  );
}
