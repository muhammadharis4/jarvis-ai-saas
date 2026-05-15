# JARVIS — AI SaaS platform

Next.js application that exposes several AI tools behind authentication: chat, code help, images (DALL·E-style), music, and short video generation. It includes a public landing page, a Clerk-protected dashboard, optional usage limits for free users, and database fields intended for Stripe subscriptions.

## What it does

| Area | Route | Backend |
|------|--------|---------|
| **AI chat** | `/conversation` | OpenAI `gpt-3.5-turbo` via `POST /api/conversation` |
| **Code assistant** | `/code` | OpenAI `gpt-3.5-turbo` (markdown code–focused system prompt) via `POST /api/code` |
| **Images** | `/image` | OpenAI Images API via `POST /api/image` |
| **Music** | `/music` | [Replicate](https://replicate.com/) model `riffusion/riffusion` via `POST /api/music` |
| **Video** | `/video` | Replicate model `anotherjesse/zeroscope-v2-xl` via `POST /api/video` |

- **Auth:** [Clerk](https://clerk.com/) — almost all routes require a signed-in user (`middleware.ts` only leaves `/` public).
- **Free tier:** Usage is tracked in MySQL (`UserApiLimit`). Default free allowance is **5** successful generations (`MAX_FREE_COUNTS` in `constants.ts`). Subscribed users skip the limit when `checkSubscription()` returns true.
- **Subscriptions:** Prisma model `UserSubscription` stores Stripe customer/subscription IDs and period end. The UI calls **`GET /api/stripe`** for checkout or the customer portal — **that API route is not included in this repository**, so the Upgrade / Manage subscription buttons will not work until you add it (and webhooks to write `UserSubscription` rows).
- **Support chat:** [Crisp](https://crisp.chat/) is wired in `components/crisp-chat.tsx` with a **hard-coded** website ID. Replace it with your own ID or remove `CrispProvider` from `app/layout.tsx` if you do not use Crisp.

## Prerequisites

- **Node.js** 18+ (recommended for Next.js 14)
- **MySQL** database (Prisma is configured for MySQL)
- Accounts / keys as needed: **Clerk**, **OpenAI**, **Replicate**

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd jarvis-ai-saas
npm install
```

### 2. Environment variables

Create a **`.env`** file in the project root (same folder as `package.json`). Do not commit real secrets.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | **Yes** | MySQL connection string for Prisma, e.g. `mysql://USER:PASSWORD@localhost:3306/jarvis` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **Yes** | Clerk publishable key |
| `CLERK_SECRET_KEY` | **Yes** | Clerk secret key |
| `OPENAI_API_KEY` | **Yes** for chat, code, image | OpenAI API key |
| `REPLICATE_API_KEY` | **Yes** for music & video | Replicate API token |

Optional Clerk URLs (set in Clerk dashboard or here if you use custom paths):

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

Example skeleton (copy and fill in):

```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/jarvis"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

OPENAI_API_KEY="sk-..."
REPLICATE_API_KEY="r8_..."
```

API routes create OpenAI/Replicate clients only when a request runs (`lib/ai-clients.ts`), so **`next build` does not require** `OPENAI_API_KEY` or `REPLICATE_API_KEY` in the build environment.

### 3. Database (Prisma)

Generate the client and apply the schema to your database (pick one):

```bash
npx prisma generate
npx prisma db push
```

Or use migrations if you maintain a migration history:

```bash
npx prisma migrate dev
```

Schema lives in `prisma/schema.prisma` (`UserApiLimit`, `UserSubscription`).

### 4. Clerk application

1. Create an application in the [Clerk dashboard](https://dashboard.clerk.com/).
2. Add **sign-in** and **sign-up** URLs that match your app (e.g. local: `http://localhost:3000`).
3. Copy the **publishable** and **secret** keys into `.env` as above.
4. In Clerk, configure allowed origins / redirect URLs for your deployment domain when you go to production.

### 5. OpenAI

1. Create an API key in the [OpenAI platform](https://platform.openai.com/).
2. Set `OPENAI_API_KEY` in `.env`.
3. Image responses use URLs on `oaidalleapiprodscus.blob.core.windows.net` — already allowed in `next.config.js` under `images.domains`.

### 6. Replicate

1. Create an account and an API token at [replicate.com](https://replicate.com/).
2. Set `REPLICATE_API_KEY` in `.env`.
3. Music and video use fixed public model strings in `app/api/music/route.ts` and `app/api/video/route.ts`; change those slugs if you want different models or versions.

### 7. Assets and branding

- **Logo:** The sidebar expects `public/logo.png`. Add that file or update `components/sidebar.tsx` to point to your asset.
- **Crisp:** Edit `components/crisp-chat.tsx` and replace the ID passed to `Crisp.configure(...)` with your Crisp website ID.

### 8. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in, then open `/dashboard` for the tool hub.

Other scripts:

```bash
npm run build       # production build
npm run start       # run production server (after build)
npm run lint        # ESLint
npm test            # unit tests (Jest)
npm run test:watch  # Jest in watch mode
```

### Automated tests

The suite uses [Jest](https://jestjs.io/) via `next/jest`. It covers:

- **`lib/utils.ts`** — `cn()` merging.
- **`lib/subscription.ts`**, **`lib/api-limit.ts`** — Prisma mocked; Clerk comes from **`test/mocks/clerk-nextjs.ts`** (`jest.config.js` `moduleNameMapper`).
- **API handlers** (`app/api/*/route.test.ts`) — auth and OpenAI/Replicate stubs in **`test/mocks/openai.ts`** and **`test/mocks/replicate.ts`** so nothing calls real APIs during tests.

`lib/subscription.test.ts` and `lib/api-limit.test.ts` load the modules under test with **`require()` after `jest.mock("./prismadb", …)`** so Prisma mocking works reliably with Next’s SWC Jest transformer. Production imports use **`./prismadb`** in those two libs (instead of `@/lib/prismadb`) specifically for stable test doubles.

## Docker

From the repo root (Docker and Docker Compose required):

1. Copy **`.env.docker.example`** to **`.env`** (or extend your existing **`.env`**) with **Clerk**, **OpenAI**, and **Replicate** keys.

2. Start MySQL + the Next.js app:

```bash
docker compose up --build
```

By default, MySQL is on **`localhost:3306`** and the app on **`http://localhost:3000`**. The `app` container receives **`DATABASE_URL`** pointing at the compose **`db`** service.

Optional overrides: **`MYSQL_*`**, **`APP_PORT`** (see **`docker-compose.yml`**). Use **`SKIP_PRISMA_PUSH=true`** on the `app` service to skip **`prisma db push`** at startup when you manage the schema yourself.

The image runs **`npm run build`** without embedding API secrets; containers still need real keys at runtime for generators and Clerk.

## Configuration knobs (code)

| What | Where |
|------|--------|
| Free generation limit | `constants.ts` → `MAX_FREE_COUNTS` |
| Which tools appear on the dashboard | `constants.ts` → `tools` |
| Public routes (no auth) | `middleware.ts` → `publicRoutes` |
| OpenAI chat / code model | `app/api/conversation/route.ts`, `app/api/code/route.ts` |
| Replicate models | `app/api/music/route.ts`, `app/api/video/route.ts` |
| App title / description | `app/layout.tsx` → `metadata` |

## Deployment notes

- Set all **production** env vars on your host (e.g. Vercel project settings).
- Run `prisma migrate deploy` (or `db push`) against your production database.
- Implement **`/api/stripe`** plus Stripe webhooks if you need working checkout and `UserSubscription` updates.
- Point Clerk to your production URL and update any `NEXT_PUBLIC_*` URLs accordingly.

## Tech stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript  
- **Auth:** `@clerk/nextjs`  
- **Database:** Prisma 5 + MySQL  
- **AI:** `openai`, `replicate`  
- **UI:** Tailwind CSS, Radix UI, Lucide icons  

## License

[MIT](./LICENSE). Replace the copyright line in `LICENSE` with your name or organization if you prefer.
