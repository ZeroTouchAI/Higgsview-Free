// Other projects from the makers of Higgsview, shown in the footer and on the home page.
// utm_source lets each site's analytics see the visits that came from Higgsview.
const from = (url: string) => `${url}?utm_source=higgsview&utm_medium=referral`;

export const PROJECTS: { name: string; url: string; blurb: string }[] = [
  { name: "Carinly", url: from("https://carinly.com"), blurb: "A private app for two people apart: translated messages, games across time zones, and one place to plan the next visit." },
  { name: "Effortless Social Media", url: from("https://effortlesssocialmedia.zerotouchai.com"), blurb: "Social media content on autopilot." },
  { name: "Effortless Cold Calling", url: from("https://effortlesscoldcalling.zerotouchai.com"), blurb: "You choose the niche. AI agents call and qualify leads, and tell you the moment someone is interested." },
  { name: "Effortless UGC", url: from("https://effortlessugc.netlify.app"), blurb: "Upload one product photo and your website: get an on-brand UGC-style ad photo in about a minute." },
  { name: "ManyReply", url: from("https://manyreply-free-docs.vercel.app"), blurb: "Free and open source: pick a keyword, and anyone who comments it on your Instagram post gets your link in a DM, automatically. Non-followers are asked to follow first. Connect your Zernio key (it stays in your browser), choose a post and a word, and end the post with \"Comment WORD for the link\". Includes link-click tracking, a DM inbox, saved replies and post analytics." },
];
