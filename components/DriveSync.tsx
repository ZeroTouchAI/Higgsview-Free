"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { refreshHistory, unavailable, useHistory, type Item } from "@/lib/history";
import { GOOGLE_CLIENT_ID, autoSave, driveConnected, driveMinutesLeft, driveToken, onDriveChange, saveToDrive, setAutoSave } from "@/lib/google";
import { KIE_KEEP_DAYS } from "@/lib/history";
import { ask, tell } from "@/components/Dialog";
import { kieBlob } from "@/lib/kieFile";
import { makeThumb } from "@/components/Controls";

// Saves one result to the user's Google Drive and records the link (+ a small still for when Kie deletes the file).
export async function saveItemToDrive(item: Item) {
  const ext = item.kind === "video" ? "mp4" : item.kind === "audio" ? "mp3" : "png";
  const file = await kieBlob(item.url!);
  const saved = await saveToDrive(file, `higgsview-${item.modelId}-${new Date(item.createdAt).toISOString().slice(0, 19).replace(/:/g, "-")}.${ext}`);
  const thumb = item.kind === "audio" ? undefined : await makeThumb(file);
  await fetch("/api/export", { method: "POST", body: JSON.stringify({ id: item.id, link: saved.link, folder: saved.folder, folderName: saved.folderName, thumb }) });
  await refreshHistory();
}

// Asked right after the user approves a generation (studio, Cinema, apps, Regenerate). Skipped when auto-save is on
// and Drive is connected. Yes = connect Google (the click still counts as a user action, so Google's popup isn't
// blocked) and switch auto-save on, so the result goes to Drive when it finishes. No = it stays on Kie, with a note.
export async function askDriveSave(kind: string) {
  if (kind === "text" || !GOOGLE_CLIENT_ID) return;
  const a = autoSave();
  if (a.on && driveConnected()) return;
  const yes = await ask({
    title: a.on ? "Reconnect Google Drive?" : "Save to Google Drive when it's done?",
    message: a.on
      ? "Your Google Drive connection has lapsed (Google asks again about every hour). Reconnect so this result is saved to your Drive automatically when it finishes."
      : "Higgsview can put this result in your Google Drive automatically when it finishes, so you keep it for good. This turns on auto-save for new results (you can switch it off in Profile).",
    confirm: "▲ Yes, save to Drive", cancel: "No, keep it on Kie",
  });
  const keep = `It will be kept on Kie.ai for about ${KIE_KEEP_DAYS} days. Download it or save it to Google Drive before then: the card shows how many days are left.`;
  if (!yes) return tell(`Kept on Kie.ai for about ${KIE_KEEP_DAYS} days`, keep);
  try {
    await driveToken();
    if (!a.on) setAutoSave(true);
  } catch (e) {
    await tell("Google Drive didn't connect", `${(e as Error).message}. ${keep}`);
  }
}

// Re-render on connect / disconnect / setting changes, and every 30 s so an expiring connection shows up.
const subscribe = (cb: () => void) => {
  const off = onDriveChange(cb);
  const t = setInterval(cb, 30_000);
  return () => { off(); clearInterval(t); };
};
export function useDrive() {
  const connected = useSyncExternalStore(subscribe, driveConnected, () => false);
  const minutes = useSyncExternalStore(subscribe, driveMinutesLeft, () => 0);
  const auto = useSyncExternalStore(subscribe, () => JSON.stringify(autoSave()), () => "{}");
  return { connected, minutes, auto: JSON.parse(auto) as { on?: boolean; since?: number } };
}

// Results that auto-save should send to Drive: finished after auto-save was switched on, still downloadable, not saved yet.
const waiting = (items: Item[], since = 0) =>
  items.filter((i) => i.state === "success" && i.url && i.kind !== "text" && !i.driveLink && !unavailable(i) && i.createdAt >= since);

// Mounted once (root layout). While auto-save is on and Drive is connected, saves new results one at a time.
// Google's Drive permission lasts about an hour; when it lapses, results wait until the user presses Reconnect.
export function DriveAutoSave() {
  const items = useHistory();
  const { connected, auto } = useDrive();
  const busy = useRef(false);
  const failed = useRef(new Set<string>());
  useEffect(() => {
    if (!auto.on || !connected || busy.current) return;
    const next = waiting(items, auto.since).find((i) => !failed.current.has(i.id));
    if (!next) return;
    busy.current = true;
    saveItemToDrive(next).catch(() => { if (driveConnected()) failed.current.add(next.id); }) // a lapsed connection isn't a failure: retry after Reconnect.finally(() => { busy.current = false; refreshHistory(); });
  }, [items, connected, auto.on, auto.since]);
  return null;
}

// Profile: connection status, connect/reconnect, and the auto-save switch.
export function DriveConnection() {
  const { connected, minutes, auto } = useDrive();
  const [err, setErr] = useState("");
  const connect = () => driveToken().then(() => setErr(""), (e) => setErr(e.message));
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white/[.04] p-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={`size-2.5 rounded-full ${connected ? "bg-lime" : "bg-amber-400"}`} />
        <span className="font-semibold">{connected ? "Connected" : "Not connected"}</span>
        <span className="text-xs text-muted">{connected ? `Google's permission lasts about ${minutes} more min` : "Connect to save to Drive (Google asks again about every hour)."}</span>
        <button onClick={connect} className="ml-auto rounded-xl px-3 py-1.5 text-sm font-semibold text-white [background-image:radial-gradient(39.71%_136.54%_at_51.64%_117.31%,#22D3EE_0%,#1f3f99_100%)] hover:brightness-110">▲ {connected ? "Reconnect" : "Connect Google Drive"}</button>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!auto.on} className="accent-lime"
          onChange={(e) => { setAutoSave(e.target.checked); if (e.target.checked && !connected) connect(); }} />
        Save every new result to Google Drive automatically
      </label>
      <p className="text-xs text-muted">While Higgsview is open and connected, finished videos, images and audio go to your Drive folder on their own. If the connection lapses (Google asks about every hour), press Reconnect here; anything that finished meanwhile is then saved, and results waiting to be saved show how long Kie keeps them.</p>
      {err && <p role="alert" className="text-xs text-red-300">{err}</p>}
    </div>
  );
}
