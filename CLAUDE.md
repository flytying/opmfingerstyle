# OPM Fingerstyle

Curated directory and community site for Filipino fingerstyle guitarists performing OPM songs.
Domain: opmfingerstyle.com

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (custom amber/gold design tokens in `globals.css`)
- **Database**: Supabase (Postgres) with Row-Level Security
- **Auth**: Supabase Auth (email/password) — two roles: `admin` and `guitarist`
- **Hosting**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (role-protected)
│   ├── dashboard/          # Guitarist self-service (auth-protected)
│   ├── guitarists/         # Public directory + profile pages
│   ├── gear/               # Gear listings + detail pages
│   ├── blog/               # Articles
│   ├── videos/             # Video listings
│   ├── tabs/               # Tab listings
│   ├── submit/             # Public profile submission form
│   ├── login/              # Auth login page
│   └── (static pages)     # about, contact, privacy-policy, affiliate-disclosure
├── components/
│   ├── layout/             # Header, Footer, MobileMenu, AuthButtons
│   └── ui/                 # GuitaristCard, VideoCard, ArticleCard, GearCard
├── lib/
│   ├── supabase/           # Server client, browser client, DB types
│   └── structured-data.ts  # JSON-LD helpers
└── middleware.ts            # Auth protection for /admin/* and /dashboard/*
supabase/
└── migrations/             # SQL schema with RLS policies
```

## Auth Model

- **Admin**: Full access to `/admin/*`. Can approve/reject guitarist submissions, manage gear and articles.
- **Guitarist**: Created when admin approves a submission (invite email sent). Can self-manage profile, videos, tabs, socials at `/dashboard/*`. All changes go live immediately.
- Public users can browse and submit profiles without auth.

## Key Patterns

- Server Components by default; `"use client"` only for forms and interactive elements
- Header auth buttons use `<Suspense>` to avoid blocking page render
- Server Actions for all form mutations (submit, admin actions, dashboard edits)
- Supabase RLS enforces data access — `is_admin()` and `my_guitarist_id()` helper functions
- `createClient()` for cookie-based auth in server components; `createServiceClient()` for admin operations bypassing RLS

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type check
```

## Database

Schema is in `supabase/migrations/001_initial_schema.sql`. Tables: `profiles`, `guitarists`, `guitarist_videos`, `tablature_links`, `social_links`, `gear_products`, `articles`.

## Environment Variables

Copy `env.example` to `.env.local` and fill in Supabase keys. Never commit `.env.local`.

@AGENTS.md
