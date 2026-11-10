// Script history: every distinct prompt the user has written, kept forever (History items stay in storage even
// after the video expires at Kie or the card is deleted). Re-runs and regenerations of the same text count once.
import type { Item } from "@/lib/history";
import { PRESETS } from "./models.ts";
import { APPS } from "./apps.ts";

// Sentences Higgsview appends to prompts by itself (camera presets, reference/brand instructions): not part of the script.
const ADDED = [
  ...PRESETS.map((p) => p.prompt).filter(Boolean),
  "Use the reference images faithfully: keep their exact colors, logos, text, products and people.",
  "Do not show any written text, letters, numbers, words, captions or logos anywhere in the video.",
];
const BRAND_LOCK = / The brand name is "[^"]*", spelled exactly [A-Z0-9-]+\. Any on-screen text must match this spelling letter for letter: never add, drop, swap or change letters\. Keep on-screen text short, large and simple\.$/;
const APP_NAMES = new Set(APPS.map((a) => a.name.toLowerCase()));
// Gallery thumbnails generated for the app itself (hidden jobs in the owner's History), not user scripts.
const THUMB = /^(Striking square|Square thumbnail|Thumbnail for the "|Cinematic 16:9 film still|Cinematic film still|Cinematic 2K film still|Cinematic painting-like photo)/;

export const cleanScript = (prompt: string) => {
  let s = prompt.trim().replace(BRAND_LOCK, "");
  for (let again = true; again; ) {
    again = false;
    for (const a of ADDED) if (s.endsWith(a)) { s = s.slice(0, -a.length).trim(); again = true; }
  }
  return s;
};

export type Script = { text: string; at: number; model: string; kind: Item["kind"]; uses: number };

export function scriptsOf(items: Item[]): Script[] {
  const byText = new Map<string, Script>();
  for (const i of [...items].sort((a, b) => b.createdAt - a.createdAt)) {
    // Skip things the user didn't write: gallery thumbnails, Join / Add-text results, apps run without text.
    if (i.group === "thumbs3" || i.modelId === "join" || i.modelId === "brand" || (i.hidden && THUMB.test(i.prompt ?? ""))) continue;
    const text = cleanScript(i.prompt ?? "");
    if (text.length < 3 || APP_NAMES.has(text.toLowerCase())) continue;
    const key = text.toLowerCase().replace(/\s+/g, " ");
    const seen = byText.get(key);
    if (seen) seen.uses++;
    else byText.set(key, { text, at: i.createdAt, model: i.modelName.split(" · ")[0], kind: i.kind, uses: 1 });
  }
  return [...byText.values()]; // newest first
}
