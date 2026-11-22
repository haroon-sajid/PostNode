# PostNode

PostNode is a self-hosted tool for scheduling and publishing social media posts. You write a post once, pick the channels, and PostNode publishes it at the scheduled time through each platform's official API.

- Calendar view of scheduled and published posts
- Publishing to X, LinkedIn, Facebook, Instagram, Threads, YouTube, TikTok, Pinterest, Reddit, Bluesky, Mastodon, Discord, Slack, Telegram and more
- Analytics, team members and a media library
- Public API and an MCP server (Settings > Developers), so AI agents such as Claude can schedule posts

Everything runs on your own server. You create your own developer app on each social platform and give PostNode its keys.

## Stack

- pnpm workspace (monorepo), Node.js 22
- `apps/frontend`: Next.js (React), Tailwind
- `apps/backend`: NestJS API
- `apps/orchestrator`: Temporal worker that publishes posts in the background
- `libraries/`: code shared by the apps
- PostgreSQL (Prisma), Redis, Temporal

## Run locally from source

Requirements: Node.js 22, pnpm 10.6.1, Docker.

1. Create `.env` from `.env.example` and fill in the Docker section and the required values below.

2. Start Redis and Temporal (add `--profile local-db` to also run a local PostgreSQL and pgAdmin instead of a hosted database such as Neon):

   ```bash
   docker compose -f docker-compose.dev.yaml up -d
   ```

3. Install dependencies and create the database tables:

   ```bash
   pnpm install
   pnpm run prisma-db-push
   ```

4. Start each app in its own terminal (run each one only once):

   ```bash
   pnpm local:backend        # API on http://localhost:3000 (docs at /docs)
   pnpm local:frontend       # web app on http://localhost:4200
   pnpm local:orchestrator   # background worker that publishes scheduled posts
   ```

   The backend and orchestrator compile first (several minutes the first time, faster afterwards), then run without watch mode. After changing backend or orchestrator code, stop it with Ctrl+C and run the command again.

5. Open http://localhost:4200 and create the first account.

## Run with Docker

`docker-compose.yaml` builds this repository into one image and runs it with PostgreSQL, Redis and Temporal.

1. Create `.env` from `.env.example`. Fill in the Docker section, `JWT_SECRET`, and the social platforms you use.
2. Build and start:

   ```bash
   docker compose up -d --build
   ```

3. Open http://localhost:4007 (or the URL you set in `POSTNODE_URL`).

The image builds for the CPU of the machine it runs on (amd64 or arm64). To build both at once:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t postnode .
```

## Required environment variables

| Variable | Purpose |
|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | App database credentials used by Docker |
| `TEMPORAL_DB_PASSWORD` | Password of Temporal's database used by Docker |
| `PGADMIN_EMAIL`, `PGADMIN_PASSWORD` | pgAdmin login (dev compose only) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Long random string used to sign sessions |
| `FRONTEND_URL` | URL where the web app is reached, e.g. `http://localhost:4200` |
| `NEXT_PUBLIC_BACKEND_URL` | URL of the API as seen from the browser, e.g. `http://localhost:3000` |
| `BACKEND_INTERNAL_URL` | URL of the API as seen from the frontend server |
| `TEMPORAL_ADDRESS` | Temporal server, defaults to `localhost:7233` |
| `STORAGE_PROVIDER` | `local` or `cloudflare` |
| `UPLOAD_DIRECTORY` | Folder for uploaded media when `STORAGE_PROVIDER=local` |

Each social platform needs its own client ID and secret (for example `X_API_KEY` / `X_API_SECRET`, `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`). Only set the platforms you use. See `.env.example` for the full list.

Optional:

| Variable | Purpose |
|---|---|
| `APP_NAME` / `NEXT_PUBLIC_APP_NAME` | Product name shown in the app, emails and MCP tools. Default `PostNode`, set in `libraries/helpers/src/utils/app.name.ts` |
| `EMAIL_PROVIDER` | `resend`, `ses` or `nodemailer`. When unset, new accounts are activated without email |
| `OPENAI_API_KEY` | Enables the AI features |

## MCP and Public API

Create an API key in Settings > Developers. The MCP endpoint is `<NEXT_PUBLIC_BACKEND_URL>/mcp`, using the API key as a Bearer token. The REST API is under `<NEXT_PUBLIC_BACKEND_URL>/public/v1`.

## Support

TODO: support@example.com

## License

AGPL-3.0, see [LICENSE](LICENSE). Attribution for the original project is in [NOTICE](NOTICE).
