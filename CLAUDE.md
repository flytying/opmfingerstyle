# OPM Fingerstyle

Curated directory and community site for Filipino fingerstyle guitarists performing OPM songs.
Domain: opmfingerstyle.com

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + Typography plugin (custom amber/gold design tokens in `globals.css`)
- **Database**: Supabase (Postgres) with Row-Level Security
- **Auth**: Supabase Auth (email/password) — two roles: `admin` and `guitarist`
- **Hosting**: Vercel (auto-deploys from `main` branch)
- **Analytics**: Google Analytics (G-EGPSP8NJ5L)
- **Monetization**: Google AdSense (ca-pub-3392449098044156), affiliate links
- **Email**: Resend (notifications), ImprovMX (forwarding)
- **AI**: Claude API (article generation), Serper.dev (web search)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (role-protected)
│   │   ├── guitarists/     # Review/approve/reject submissions
│   │   ├── gear/           # Gear CRUD with inline create form
│   │   ├── reports/        # Video reports with strike system
│   │   └── messages/       # Contact form submissions inbox
│   ├── api/cron/           # Vercel Cron endpoints
│   ├── auth/               # Invite confirm + set password flow
│   ├── dashboard/          # Guitarist self-service (auth-protected)
│   │   ├── profile/        # Edit bio, photo, location
│   │   ├── videos/         # Video list (YouTube-style table)
│   │   │   ├── new/        # Separate add video page
│   │   │   └── [id]/edit/  # Separate edit video page
│   │   ├── tabs/           # Add/remove tablature links
│   │   ├── socials/        # Add/remove social links
│   │   └── settings/       # Account settings (email/password)
│   ├── guitarists/         # Public directory + profile pages (with search)
│   ├── gear/               # Gear listings + detail pages (with category filter)
│   ├── blog/               # Auto-generated articles
│   ├── videos/             # Video listings + detail pages (/videos/[slug])
│   ├── tabs/               # Tab listings
│   ├── submit/             # Public profile submission form
│   ├── contact/            # Contact form (dropdown subjects)
│   ├── login/              # Auth login page
│   ├── forgot-password/    # Password reset flow
│   └── (static pages)     # about, privacy-policy, affiliate-disclosure
├── components/
│   ├── layout/             # Header, Footer, MobileMenu, AuthButtons, UserMenu
│   └── ui/                 # GuitaristCard, VideoCard, ArticleCard, GearCard, PhotoUpload, RichEditor, ReportVideo
├── lib/
│   ├── article-agent/      # Automated blog content generation
│   ├── supabase/           # Server client, browser client, DB types
│   ├── structured-data.ts  # JSON-LD helpers (Person, Product, Article, VideoObject, WebSite)
│   ├── genre-detect.ts     # Auto-detect genre from video title/description
│   ├── email.ts            # Resend notifications (submissions, contact, reports)
│   └── utils.ts            # Shared utilities (slugify, YouTube helpers, formatDate)
├── middleware.ts            # Auth protection + x-pathname header for layout detection
├── __tests__/              # Vitest unit tests (42 tests)
scripts/
├── generate-article.ts     # CLI: npm run generate-article
└── update-genres.ts        # Bulk update video genres
supabase/
└── migrations/             # SQL schema with RLS policies (006 migrations)
```

## Auth Model

- **Admin**: Full access to `/admin/*`. Can approve/reject submissions, manage gear, view reports/messages.
- **Guitarist**: Created when admin approves a submission. Can self-manage profile, videos, tabs, socials at `/dashboard/*`. All changes go live immediately.
- **Strike system**: 3 strikes from reported videos = auto-disable account.
- Public users can browse, submit profiles, report videos, and send contact messages without auth.
- Header shows avatar dropdown when logged in, "Submit Profile" + "Log In" when not.

## Auth Flow (Invite)

- Admin approves → `createUser()` with temp password → `generateLink({ type: "recovery" })` → branded email via Resend
- Supabase redirects with `#access_token=...` hash fragment (NOT query params)
- `/auth/confirm` client page parses hash → calls `setSession()` → redirects to `/auth/set-password`
- Recovery tokens are single-use — don't click in admin browser, test in incognito
- Never use `inviteUserByEmail()` — Supabase SMTP is unreliable, send via Resend directly

## Key Patterns

- Server Components by default; `"use client"` only for forms and interactive elements
- Header auth buttons use `<Suspense>` to avoid blocking page render
- Header variant: middleware sets `x-pathname` header → public pages use `max-w-7xl`, admin/dashboard use full-width
- Server Actions for all form mutations (submit, admin actions, dashboard edits)
- Supabase RLS enforces data access — `is_admin()` and `my_guitarist_id()` helper functions
- `createClient()` for cookie-based auth in server components; `createServiceClient()` for admin operations bypassing RLS
- Guitarist directory has live search (URL params, server-side filtering)
- Videos and tabs pages have search + filter by artist
- Gear page has sticky category filter with smooth-scroll to sections
- Blog articles auto-generated weekly by article agent (no manual admin)
- Video genre auto-detected from title/description using keyword rules

## Gotchas

- `source ~/.nvm/nvm.sh` required before all `node`/`npm`/`npx` commands in this environment
- Delete `.next/` cache when removing pages (stale type validators cause TS errors)
- Supabase RLS: `FOR ALL` policies block anonymous inserts — use specific `FOR SELECT/UPDATE/DELETE` for admin + separate `FOR INSERT` for anon
- Supabase `insert().select()` fails for anon users who can't read back the row — use `insert()` without `.select()` for public forms
- `next/script` with `afterInteractive` is invisible to crawlers — use raw `<script>` for AdSense verification
- Hero background: use raw `<img fetchPriority="high" decoding="sync">` for LCP, not `next/image` which adds `decoding="async"`
- `dotenv.config({ override: true })` needed in CLI scripts — `tsx` auto-injects env but may not override existing vars
- DNS: domain uses DreamHost nameservers with A record (76.76.21.21) pointing to Vercel — do NOT use Vercel nameservers (unreliable)

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm test                 # Run Vitest (42 tests)
npm run test:watch       # Vitest watch mode
npx tsc --noEmit         # Type check
npm run generate-article # Manually generate a blog article
```

## Article Agent

Automated weekly blog content generation (`src/lib/article-agent/`):
- **8 topics** rotating by ISO week number: arrangements, technique, gear, spotlights, song deep dives, beginner guides, maintenance, music scene news
- **Pipeline**: select topic → Serper.dev search → deduplicate against recent articles → Claude API generates HTML article → Pexels featured image → publish to Supabase
- **Scheduling**: Vercel Cron every Monday 9am UTC (`vercel.json`)
- **Manual run**: `npm run generate-article`

## Database

Schema in `supabase/migrations/` (6 migrations). Tables: `profiles`, `guitarists`, `guitarist_videos`, `tablature_links`, `social_links`, `gear_products`, `articles`, `contact_submissions`, `video_reports`.

Key columns:
- `guitarist_videos`: `slug`, `description`, `genre` (TEXT[])
- `guitarists`: `strikes` (INT, 3 strikes = auto-disable)

## Environment Variables

Copy `env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`, `SERPER_API_KEY`, `PEXELS_API_KEY` (article agent)

Optional:
- `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL` (email notifications)
- `CRON_SECRET` (auto-set by Vercel)

Never commit `.env.local`.

## Design System

- **Accent**: Warm amber/gold (`#D4A017` primary)
- **Background**: White, off-white (`#FAFAFA` surface)
- **Typography**: Inter, bold headings, clean sans-serif
- **Profile pages**: Full-bleed hero photo + structured content below
- **Admin/Dashboard**: Sidebar nav + white cards on light gray, full-width header
- **Public pages**: `max-w-7xl` centered content

@AGENTS.md
