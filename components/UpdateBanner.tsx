"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { VERSION } from "@/components/AccountMenu";

// An open tab keeps running the code it loaded; after a deploy it would stay on the old version until a full
// reload. Check the live version on load, when the tab regains focus and every 5 minutes, and offer a refresh.
export default function UpdateBanner() {
  const path = usePathname();
  const [live, setLive] = useState<string>();
  useEffect(() => {
    const check = () => fetch("/api/version", { cache: "no-store" }).then((r) => r.json()).then((d) => d.version && setLive(d.version), () => {});
    check();
    const t = setInterval(check, 5 * 60_000);
    addEventListener("focus", check);
    return () => { clearInterval(t); removeEventListener("focus", check); };
  }, []);
  if (!live || live === VERSION || path === "/login") return null;
  return (
    <div role="status" className="flex items-center justify-center gap-3 bg-lime px-4 py-2 text-sm font-semibold text-black">
      A new version of Higgsview is live (v{live}). You&apos;re on v{VERSION}.
      <button onClick={() => location.reload()} className="rounded-lg bg-black px-3 py-1 text-xs font-bold text-lime hover:opacity-90">Refresh</button>
    </div>
  );
}
