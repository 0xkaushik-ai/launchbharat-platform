# LaunchBharat Platform

LaunchBharat is a nationwide startup and innovation platform. This repository is the new Kaushik-owned platform source and is intentionally separate from the earlier deployments.

## Architecture

The repository is one npm-workspaces monorepo deployed as two Vercel projects:

- `apps/web` — the public website, events directory, and programme application form.
- `apps/admin` — a separately deployed staff console for applications, events, and tickets.
- `packages/database` — shared domain aliases and generated Supabase TypeScript types.
- `supabase` — the version-controlled database schema, RLS policies, RPC workflows, and local configuration.

Both applications use the same Supabase project. The public application has no administrative routes or privileged key. The admin application still uses only the publishable key: authorization is enforced by Supabase Auth, `user_roles`, RLS, and security-definer RPCs.

## Local development

1. Copy `.env.example` to both `apps/web/.env.local` and `apps/admin/.env.local`.
2. Install dependencies with `npm install`.
3. Run `npm run dev:web` for the website on port 3000.
4. Run `npm run dev:admin` for the admin console on port 3001.

Useful checks:

```bash
npm run typecheck
npm run build:web
npm run build:admin
```

## Supabase workflow

The linked project is configured under `supabase/`. Create all database changes as migrations and apply them with:

```bash
npx supabase db push --linked --dry-run
npx supabase db push --linked
npx supabase gen types typescript --linked --schema public > packages/database/src/database.types.ts
```

To bootstrap the first admin, first create the user in Supabase Auth, then execute this one-time statement in the SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'ADMIN_EMAIL_HERE';
```

Never add a service-role key to either Next.js application. Notification delivery should consume `notification_outbox` from a server-only worker or Supabase Edge Function.
