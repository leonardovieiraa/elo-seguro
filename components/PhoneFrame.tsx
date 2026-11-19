import { SignalIcon, WifiIcon, BatteryIcon } from "./Icons";

type Props = {
  children: React.ReactNode;
  /** versão interativa: ocupa a tela toda em celulares reais */
  live?: boolean;
  hideStatus?: boolean;
  overlay?: React.ReactNode;
};

export default function PhoneFrame({ children, live, hideStatus, overlay }: Props) {
  return (
    <div className={`phone ${live ? "live" : ""}`}>
      <div className="phone-inner">
        <div className="notch" />
        {!hideStatus && (
          <div className="statusbar">
            <span>9:41</span>
            <span className="icons">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon size={26} />
            </span>
          </div>
        )}
        {children}
        {overlay}
      </div>
    </div>
  );
}
