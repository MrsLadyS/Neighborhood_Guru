## Neighborhood Guru Property Management

Production-ready Next.js app for:
- property listings
- tenant registration
- rental period scheduling
- availability protection (no double-booking)

## Local Setup

1. Install dependencies:
   - `npm install`
2. Create `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=https://tuxvxyayheosxduaogsj.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>`
3. Start the app:
   - `npm run dev`

## Supabase Database Setup

For an empty database, run:
1. `supabase/schema.sql`
2. `supabase/seed.sql` (optional starter data)

For existing databases only, apply migration scripts from `supabase/migrations/` as needed.

## Pre-Launch Checks

Run before pushing/deploying:
- `npm run check`
- `npm run build`

`npm run check` includes:
- ESLint
- TypeScript no-emit typecheck

## GitHub + Custom Domain Launch Checklist

1. Push repository to GitHub.
2. Import repo into your deployment platform (recommended: Vercel).
3. Set environment variables in the deployment dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy and verify:
   - `/`
   - `/properties`
   - `/schedule`
   - `/register`
   - `/pay`
5. Connect custom domain in the deployment dashboard.
6. Update DNS records at your domain registrar as instructed by the host.
7. Confirm HTTPS certificate issuance and final domain routing.

## Security Notes

- `.env.local` is ignored by git.
- RLS policies are included in schema/migrations.
- Scheduling prevents overlapping bookings for the same property at both:
  - application layer
  - database constraint layer
