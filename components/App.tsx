"use client";

import { useCallback, useEffect, useState } from "react";
import { StoreProvider, useStore, AlertRecord } from "@/lib/store";
import SplashScreen from "./SplashScreen";
import HomeScreen, { HomeTarget } from "./HomeScreen";
import AlertScreen from "./AlertScreen";
import ContactsScreen from "./screens/ContactsScreen";
import ContactFormScreen from "./screens/ContactFormScreen";
import LocationScreen from "./screens/LocationScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AlertDetailScreen from "./screens/AlertDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import CountdownScreen from "./screens/CountdownScreen";
import type { Tab } from "./ui";
import AuthGate from "./AuthGate";

type Route =
  | { name: "splash" }
  | { name: "home" }
  | { name: "history" }
  | { name: "profile" }
  | { name: "contacts" }
  | { name: "contactForm"; id?: string }
  | { name: "location" }
  | { name: "settings" }
  | { name: "notifications" }
  | { name: "alertDetail"; id: string }
  | { name: "countdown"; origem: "app" | "pulseira" }
  | { name: "sent"; record: AlertRecord };

function Inner() {
  const store = useStore();
  const [stack, setStack] = useState<Route[]>([{ name: "splash" }]);
  const route = stack[stack.length - 1];

  const go = useCallback((r: Route) => setStack((s) => [...s, r]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const reset = useCallback((r: Route) => setStack([r]), []);

  // splash some sozinha
  useEffect(() => {
    if (route.name !== "splash") return;
    const t = setTimeout(() => reset({ name: "home" }), 2500);
    return () => clearTimeout(t);
  }, [route.name, reset]);

  const goTab = (t: Tab) => reset({ name: t });
  const tabOf = (n: string): Tab => (n === "history" ? "history" : n === "profile" ? "profile" : "home");

  let screen: React.ReactNode = null;

  switch (route.name) {
    case "splash":
      screen = <SplashScreen onContinue={() => reset({ name: "home" })} />;
      break;

    case "home":
      screen = (
        <HomeScreen
          nome={store.profile.nome.split(" ")[0] || "você"}
          unread={store.unread}
          connected={store.connected}
          connecting={store.connecting}
          battery={store.battery}
          modelo={store.modelo}
          sharing={store.sharing.ativo}
          onModelo={store.setModelo}
          onBell={() => go({ name: "notifications" })}
          onPill={store.toggleConnection}
          onTile={(t: HomeTarget) => {
            if (t === "history") goTab("history");
            else go({ name: t });
          }}
          onAlert={() => go({ name: "countdown", origem: "app" })}
          tab="home"
          onTab={goTab}
        />
      );
      break;

    case "history":
      screen = (
        <HistoryScreen
          tab="history"
          onTab={goTab}
          onOpen={(id) => go({ name: "alertDetail", id })}
        />
      );
      break;

    case "profile":
      screen = <ProfileScreen tab="profile" onTab={goTab} />;
      break;

    case "contacts":
      screen = (
        <ContactsScreen
          onBack={back}
          onAdd={() => go({ name: "contactForm" })}
          onEdit={(id) => go({ name: "contactForm", id })}
        />
      );
      break;

    case "contactForm":
      screen = <ContactFormScreen id={route.id} onBack={back} />;
      break;

    case "location":
      screen = <LocationScreen onBack={back} />;
      break;

    case "settings":
      screen = (
        <SettingsScreen
          onBack={back}
          onBraceletButton={() => go({ name: "countdown", origem: "pulseira" })}
        />
      );
      break;

    case "notifications":
      screen = <NotificationsScreen onBack={back} />;
      break;

    case "alertDetail":
      screen = <AlertDetailScreen id={route.id} onBack={back} />;
      break;

    case "countdown":
      screen = (
        <CountdownScreen
          origem={route.origem}
          onCancel={back}
          onDone={(record) => reset({ name: "sent", record })}
          onAddContacts={() => setStack((s) => [...s.slice(0, -1), { name: "contactForm" }])}
        />
      );
      break;

    case "sent":
      screen = (
        <AlertScreen
          semLocalizacao={route.record.lat == null}
          onOk={() => reset({ name: "home" })}
          onDetail={() => setStack([{ name: "home" }, { name: "alertDetail", id: route.record.id }])}
        />
      );
      break;
  }

  const key = route.name + ("id" in route ? (route.id ?? "") : "");

  return (
    <div className="app-shell">
      <div className="fade" key={key} data-tab={tabOf(route.name)}>
        {store.ready ? screen : null}
      </div>
      {store.toast && <div className="toast">{store.toast}</div>}
    </div>
  );
}

export default function App() {
  return (
    <AuthGate>
      <StoreProvider>
        <Inner />
      </StoreProvider>
    </AuthGate>
  );
}
