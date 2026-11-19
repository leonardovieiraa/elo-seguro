import Link from "next/link";
import App from "@/components/App";

export default function Page() {
  return (
    <main className="stage">
      <div className="nav-links">
        <Link href="/">← Ver as 3 telas</Link>
      </div>
      <App />
    </main>
  );
}
