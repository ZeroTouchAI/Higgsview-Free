# Higgsview

A free, open-source AI video and image studio. One dark, fast workspace for the best video and image models, with no subscription: you bring your own [Kie.ai](https://kie.ai?ref=1a59fa7ee273317c3dcdbc4f9ca41b62) key and pay Kie's raw per-generation prices. Every model shows its estimated cost before you click Generate.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZeroTouchAI%2FHiggsview-free&env=NEXT_PUBLIC_GOOGLE_CLIENT_ID,SESSION_SECRET&envDescription=Google%20OAuth%20client%20ID%20and%20a%20random%20session%20secret%20(see%20README)&stores=%5B%7B%22type%22%3A%22blob%22%7D%5D)

> Higgsview is an independent project. It is not affiliated with, endorsed by, or connected to Higgsfield or any model provider.

## What you get

- **Video**: Seedance 2 / 2.5, Kling 3, Veo 3.1, Wan 2.7, Grok Imagine, MiniMax H3, Gemini Omni and more. Text or images in (up to 9 reference images and reference videos, depending on the model), first/last-frame mode, native audio.
- **Image**: Nano Banana 2 / 2.1 / Pro, GPT Image 2, Seedream 5 Pro, FLUX.2 Pro, Ideogram V3, plus a free no-key model.
- **Audio**: voiceover, music and sound effects.
- **Genjutsu**: swap people, outfits or products in an existing video, or transfer its motion.
- **200+ one-click apps and effects**: product ads, Ads Studio (your website into a batch of image ads), URL / Script to Video, face and character swap, upscalers, lip-sync, video translator, camera moves, mixed-media styles.
- **Cinema Studio**: pick camera, lens, focal length and moves.
- **Finishing tools**: Join clips, Add text (your exact brand name or logo on a video), Download, and save to your own Google Drive.
- **Spending page** and a live Kie balance, with a confirmation before anything expensive runs.

## How it works

- **Sign in with Google.** Each person gets their own private History and Spending.
- **Bring your own Kie.ai key.** All models run through Kie.ai (one key, pay as you go). The key is stored **only in your browser** and sent with each request; the server never saves it.
- **Google Drive export** saves results to a folder in your own Drive (the app can only see files it creates or the folder you pick).
- **Results live at Kie.ai** for a limited time (about two weeks). History shows a countdown; download or save to Drive what you want to keep. Uploaded inputs are deleted after 7 days.

## Get a Kie.ai key

1. Sign up at **[kie.ai](https://kie.ai?ref=1a59fa7ee273317c3dcdbc4f9ca41b62)** (Google login works). New accounts usually start with a few free credits.
2. Add a little credit under **Billing** ($5 is plenty to try it; 1 credit = $0.005).
3. Copy your key from **[API Keys](https://kie.ai/api-key?ref=1a59fa7ee273317c3dcdbc4f9ca41b62)** and paste it into Higgsview when it asks.

*Disclosure: the Kie.ai links in this project are referral links. Signing up through them costs you nothing extra and supports the project.*

## Deploy your own (free Vercel Hobby plan)

1. Click **Deploy with Vercel** above. It copies the repo and creates a Blob store.
2. Create a Google OAuth client at [console.cloud.google.com](https://console.cloud.google.com) → **Google Auth Platform**:
   - **Branding**: app name, your email, home page (your site), privacy policy (`https://your-site/privacy`), authorized domain.
   - **Data Access**: add the scope `https://www.googleapis.com/auth/drive.file`.
   - **APIs & Services → Library**: enable the **Google Drive API**.
   - **Clients → Create client → Web application**. Authorized JavaScript origins: your site (e.g. `https://my-higgsview.vercel.app`) and `http://localhost:3000`. No redirect URIs needed.
   - **Audience → Publish app** (otherwise only test users can sign in).
3. In Vercel → Settings → Environment Variables set:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: the client ID
   - `SESSION_SECRET`: any long random string
   - optional extras are described in [.env.example](.env.example) (`SITE_HOST`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `CRON_SECRET`, `NEXT_PUBLIC_GOOGLE_API_KEY`, `OWNER_EMAIL` + `KIE_API_KEY`)
4. Redeploy. Open your site, sign in, paste your Kie key.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```

## Project map

| Path | What it is |
|---|---|
| `lib/models.ts` | Every model: options, price, and the exact Kie request it builds. Add a model = add one entry. |
| `lib/apps.ts` | The one-click apps and effects, as small recipes of steps. |
| `lib/run.ts`, `app/api/generate`, `app/api/history` | Start jobs, poll Kie, continue multi-step apps. |
| `lib/auth.ts`, `proxy.ts`, `app/api/login` | Google sign-in and the session cookie. |
| `components/KeyGate.tsx`, `lib/kie.ts` | The Kie key: kept in the browser, passed per request. |
| `lib/store.ts` | Per-user JSON storage in Vercel Blob. |
| `components/Workspace.tsx`, `components/Feed.tsx` | The studio panel and the result cards. |
| `lib/google.ts` | Google sign-in button, Drive saving, folder picker. |

Commands: `npm run dev`, `npm run check` (sanity check of models and apps), `npm run lint`, `npm run build`.

## Good to know

- Prices come from Kie's public price list and are estimates; the real charge is recorded on each result.
- Seedance blocks real human faces; use the Kling-based "Real People" options for those.
- AI video models can misspell words. Use the **Brand name** box, or keep text out of the video and add it with **Add text**.
- This project is built on Next.js (App Router) and Tailwind. `AGENTS.md` is generated by Next.js for coding assistants.

## More from the makers

- **[Carinly](https://carinly.com?utm_source=higgsview&utm_medium=referral)**: a private app for two people apart: translated messages, games across time zones, and one place to plan the next visit.
- **[Effortless Social Media](https://effortlesssocialmedia.zerotouchai.com?utm_source=higgsview&utm_medium=referral)**: social media content on autopilot.
- **[Effortless Cold Calling](https://effortlesscoldcalling.zerotouchai.com?utm_source=higgsview&utm_medium=referral)**: you choose the niche; AI agents call and qualify leads.
- **[Effortless UGC](https://effortlessugc.netlify.app?utm_source=higgsview&utm_medium=referral)**: one product photo and your website in, an on-brand UGC-style ad photo out.
- **[ManyReply](https://manyreply-free-docs.vercel.app?utm_source=higgsview&utm_medium=referral)**: free and open source. Pick a keyword; anyone who comments it on your Instagram post gets your link by DM, with a follow-first gate, link tracking, a DM inbox and analytics. Your Zernio key stays in your browser.

## License

[MIT](LICENSE). Use it, change it, host it.
