import type { Metadata } from "next";
import DialogHost from "@/components/Dialog";
import { PROJECTS } from "@/lib/projects";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import KeyGate from "@/components/KeyGate";
import UpdateBanner from "@/components/UpdateBanner";
import { DriveAutoSave } from "@/components/DriveSync";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Higgsview — AI Video Generator",
  description: "Free AI video & image studio: every top model at raw Kie.ai prices",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <UpdateBanner />
        <Nav />
        <KeyGate>{children}</KeyGate>
        <DialogHost />
        <DriveAutoSave />
        <footer className="mt-auto py-4 text-center text-xs text-muted">
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
            <>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}&su=Higgsview%20help%20%2F%20feedback`} target="_blank" rel="noreferrer" className="hover:text-fg">Help &amp; feedback</a>
              <span className="mx-2">·</span>
            </>
          )}
          <a href="/privacy" className="hover:text-fg">Privacy</a>
          <span className="mx-2">·</span>
          Powered by <a href="https://zerotouchai.com" target="_blank" rel="noreferrer" className="font-semibold text-fg hover:text-lime">ZeroTouchAI.com</a>
          <p className="mt-2">
            More from the makers:{" "}
            {PROJECTS.map((p, n) => (
              <span key={p.name}>{n > 0 && <span className="mx-1.5">·</span>}<a href={p.url} target="_blank" rel="noreferrer" title={p.blurb} className="hover:text-fg">{p.name}</a></span>
            ))}
          </p>
        </footer>
      </body>
    </html>
  );
}
