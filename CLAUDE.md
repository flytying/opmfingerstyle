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
│   │   └── messages/       # Contact form submissions inbox
│   ├── api/cron/           # Vercel Cron endpoints
│   ├── dashboard/          # Guitarist self-service (auth-protected)
│   │   ├── profile/        # Edit bio, photo, location
│   │   ├── videos/         # Add/remove YouTube videos
│   │   ├── tabs/           # Add/remove tablature links
│   │   └── socials/        # Add/remove social links
│   ├── guitarists/         # Public directory + profile pages (with search)
│   ├── gear/               # Gear listings + detail pages (with category filter)
│   ├── blog/               # Auto-generated articles
│   ├── videos/             # Video listings
│   ├── tabs/               # Tab listings
│   ├── submit/             # Public profile submission form (with photo upload)
│   ├── contact/            # Contact form (dropdown subjects)
│   ├── login/              # Auth login page
│   └── (static pages)     # about, privacy-policy, affiliate-disclosure
├── components/
│   ├── layout/             # Header, Footer, MobileMenu, AuthButtons
│   └── ui/                 # GuitaristCard, VideoCard, ArticleCard, GearCard, PhotoUpload, RichEditor
├── lib/
│   ├── article-agent/      # Automated blog content generation
│   │   ├── topics.ts       # 8 weekly rotating topics
│   │   ├── research.ts     # Serper.dev web search
│   │   ├── generate.ts     # Claude API article generation
│   │   ├── images.ts       # Pexels API featured images
│   │   ├── publish.ts      # Supabase insert + deduplication
│   │   └── index.ts        # Orchestrator
│   ├── supabase/           # Server client, browser client, DB types
│   ├── structured-data.ts  # JSON-LD helpers (Person, Product, Article, WebSite)
│   ├── email.ts            # Resend notifications (submissions, contact)
│   └── utils.ts            # Shared utilities (slugify, YouTube helpers, formatDate)
├── middleware.ts            # Auth protection for /admin/* and /dashboard/*
├── __tests__/              # Vitest unit tests (42 tests)
scripts/
└── generate-article.ts     # CLI: npm run generate-article
supabase/
└── migrations/             # SQL schema with RLS policies
```

## Auth Model

- **Admin**: Full access to `/admin/*`. Can approve/reject guitarist submissions, manage gear, view contact messages.
- **Guitarist**: Created when admin approves a submission (invite email sent via Supabase). Can self-manage profile, videos, tabs, socials at `/dashboard/*`. All changes go live immediately.
- Public users can browse, submit profiles, and send contact messages without auth.
- Header shows "Admin"/"Dashboard" button when logged in, "Submit Profile" + "Log In" when not.

## Key Patterns

- Server Components by default; `"use client"` only for forms and interactive elements
- Header auth buttons use `<Suspense>` to avoid blocking page render
- Server Actions for all form mutations (submit, admin actions, dashboard edits)
- Supabase RLS enforces data access — `is_admin()` and `my_guitarist_id()` helper functions
- `createClient()` for cookie-based auth in server components; `createServiceClient()` for admin operations bypassing RLS
- Guitarist directory has live search (URL params, server-side filtering)
- Gear page has sticky category filter with smooth-scroll to sections
- Blog articles auto-generated weekly by article agent (no manual admin)

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

Schema in `supabase/migrations/`. Tables: `profiles`, `guitarists`, `guitarist_videos`, `tablature_links`, `social_links`, `gear_products`, `articles`, `contact_submissions`.

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
- **Admin/Dashboard**: Clean white cards on light gray, minimal UI

@AGENTS.md
