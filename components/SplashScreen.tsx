import Logo from "./Logo";
import Bracelet from "./Bracelet";

export default function SplashScreen({ onContinue }: { onContinue?: () => void }) {
  return (
    <div
      className="phone-screen splash"
      onClick={onContinue}
      style={{ cursor: onContinue ? "pointer" : "default" }}
    >
      <div className="corner" />
      <span className="spark s1">✦</span>
      <span className="spark s2">✦</span>

      <div className="splash-content">
        <Logo size={140} />
        <h1 className="brand">
          Elo <span className="accent">Seguro</span>
        </h1>
        <p className="tagline">Seu cuidado, sempre conectado.</p>
        <div className="splash-bracelet">
          <Bracelet width={320} sparkles />
        </div>
      </div>

      <svg className="wave" viewBox="0 0 330 170" preserveAspectRatio="none" aria-hidden>
        <path d="M0 40 C60 0 120 10 190 40 C250 66 300 20 330 0 L330 170 L0 170 Z" fill="#3b3a78" />
        <path d="M0 70 C70 50 150 80 220 90 C270 96 305 80 330 60 L330 170 L0 170 Z" fill="#efb0d3" />
      </svg>
    </div>
  );
}
