# Supabase connectivity (client + env)

Wires `@supabase/supabase-js` + `@supabase/ssr` for the Next.js App Router. **No catalog schema yet** — that is Phase 2.

## Windows: create `.env.local`

```bat
copy .env.example .env.local
notepad .env.local
```

Set:

```
NEXT_PUBLIC_SUPABASE_URL=https://xvsblrksjycreicjvuui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-jwt-here
```

Get the **anon public** JWT from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings → API**, or reuse the key you already saved offline. **Never commit `.env.local` or paste the JWT into git/README.**

## Run + smoke check

```bat
npm install
npm run dev
```

Open [http://localhost:3000/api/supabase-health](http://localhost:3000/api/supabase-health)

Expect `{ "ok": true, ... }`. `hasSession: false` is normal when logged out.

## Code

| File | Role |
|------|------|
| `lib/supabase/client.ts` | Browser client (`createBrowserClient`) |
| `lib/supabase/server.ts` | Server client (`createServerClient` + cookies) |
| `app/api/supabase-health/route.ts` | Connectivity check via `auth.getSession()` |
