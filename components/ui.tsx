import { HomeIcon, ChartIcon, UserIcon } from "./Icons";

export type Tab = "home" | "history" | "profile";

export function TabBar({ tab, onTab }: { tab?: Tab; onTab?: (t: Tab) => void }) {
  const item = (t: Tab, label: string, icon: React.ReactNode) => (
    <button className={`tab ${tab === t ? "active" : ""}`} onClick={() => onTab?.(t)}>
      {icon}
      {label}
    </button>
  );
  return (
    <nav className="tabbar">
      {item("home", "Início", <HomeIcon />)}
      {item("history", "Histórico", <ChartIcon />)}
      {item("profile", "Perfil", <UserIcon />)}
    </nav>
  );
}

export function Shell({
  title,
  onBack,
  right,
  tab,
  onTab,
  children,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  tab?: Tab;
  onTab?: (t: Tab) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="phone-screen sub">
      <header className="sub-header">
        {onBack ? (
          <button className="icon-btn" onClick={onBack} aria-label="Voltar">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
        ) : (
          <span style={{ width: 36 }} />
        )}
        <h2>{title}</h2>
        <span style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right}</span>
      </header>
      <div className={`sub-body ${tab ? "" : "no-tab"}`}>{children}</div>
      {tab && <TabBar tab={tab} onTab={onTab} />}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <div className="toggle-row">
      <div>
        <div className="t-label">{label}</div>
        {desc && <div className="t-desc">{desc}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <em>{error}</em>}
    </label>
  );
}
