# site

Source for darcysideofthemoon.com: product design case studies, build logs, and the reasoning behind every decision. Next.js + MDX on Vercel.

## Stack

Next.js (App Router) · MDX · TypeScript · plain CSS with design tokens · Vercel

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
```

Needs Node 20 or newer.

## Publishing a post

1. Copy `content/_templates/journal-post.mdx` to `content/journal/your-slug.mdx`.
2. Fill in the frontmatter and write the body in Markdown.
3. Set `draft: false`.
4. `git add . && git commit -m "post: your title" && git push`. Vercel deploys automatically.

**Scheduling:** a post appears once its `date` has arrived. Write a batch now, set future dates, and they go live one by one. The site re-checks hourly. In `npm run dev` everything shows, including drafts and future posts.

**Frontmatter reference**

| Field | Notes |
| --- | --- |
| `title`, `dek` | Headline and one-line summary |
| `date` | `YYYY-MM-DD`. Future dates stay hidden |
| `type` | `case-study`, `build-log`, or `ai-stack` |
| `tags` | Powers the topic filter on the journal page |
| `project` | `uxrvision`, `dogfoodie`, `fidofoodie`, or `null` |
| `vendor`, `day` | Optional, for a Vercel/Supabase daily series |
| `featured` | `true` pins the post at the top of the journal |
| `draft` | `true` hides it in production |
| `videoUrl` | Optional embedded walkthrough (YouTube, Vimeo, Loom, or .mp4) |
| `specs` | The Build Specs card: `synopsis`, `built`, `timeToShip`, `difficulty` (1-5), `tools[]` |

The journal page's search, filters, and sort all live in the URL, so any filtered view is linkable, e.g. `/journal?type=ai-stack&project=uxrvision`.

## Projects

Each project is a file in `content/projects/`. Fill in `url`, `prototypeUrl`, `videoUrl`, and `repoUrl` as each piece ships. Leave one out and the page shows a "coming soon" panel instead. Never add a `repoUrl` for a private project.

## Your details

Edit `src/lib/site.ts` for your social links and email. Empty values are hidden automatically. Put your résumé PDF at `public/resume.pdf`.

## Deploying

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo, and deploy. No settings need changing.
3. In **Settings → Domains**, add `darcysideofthemoon.com` and follow the DNS instructions.

## Never commit secrets

`.env*` files are git-ignored. This repo is public, so keep API keys and tokens in Vercel's **Environment Variables** instead.

## License

Code is released under the [MIT License](LICENSE).
All written content, videos, images, and branding (including the posts,
walkthroughs, and the Darcy Side of the Moon name and visual identity)
are © 2026 Darcy Side of the Moon. All rights reserved.
