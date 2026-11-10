@AGENTS.md

This is the public, self-hostable sibling of the private Higgsview app. Features and fixes are ported here from there, and the
two share one version number (`VERSION` in `components/AccountMenu.tsx` + `package.json`). Keep it generic and safe to publish:

- No owner-specific values: no personal email, domain, Google client ID, project IDs or keys. Use the env vars in `.env.example`
  (`SITE_HOST`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_SITE_OWNER`, `OWNER_EMAIL`).
- Keep `lib/kieLinks.ts` (the Kie.ai referral code) and the "More from the makers" links (`lib/projects.ts`).
- If you fix something here that the private repo lacks (e.g. the address check in `lib/run.ts`), tell the owner so it is ported back.
