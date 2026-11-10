import pkg from "@/package.json";

// The version that is live right now (package.json of the deployed build). Open tabs compare it with the
// version they loaded and offer a refresh when a newer one is out (components/UpdateBanner.tsx).
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json({ version: pkg.version.replace(/\.0$/, "") }, { headers: { "Cache-Control": "no-store" } });
}
