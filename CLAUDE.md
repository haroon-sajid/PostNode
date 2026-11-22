This project is PostNode, a self-hosted tool to schedule social media and chat posts to many channels.
Posts added to the calendar go into a Temporal workflow and are published at the right time.
Main areas:
- Schedule posts
- Calendar view
- Analytics
- Team management
- Media library
- Public API and MCP server (Settings > Developers). These must keep working; the owner connects Claude to the app through MCP.

This project is a monorepo with a root-only package.json of dependencies, managed with pnpm.

- apps/backend - the API (NestJS)
- apps/orchestrator - the Temporal worker for background jobs (NestJS); it contains all the workflows and activities
- apps/frontend - the web app (Next.js, React)
- libraries/ - services shared between backend, orchestrator and frontend

Product name:
- The name is defined once in libraries/helpers/src/utils/app.name.ts (getAppName()). Never hardcode it.
- In translation files use {{appName}}; in code use getAppName().

Privacy:
- The app must not send data to any server the owner did not configure: no analytics, tracking or telemetry.
- Calls to the official social platform APIs are the core of the product and stay.

We are using only pnpm, don't use any other dependency manager.
Never install frontend components from npmjs, focus on writing native components.

The project uses Tailwind 3. Before writing any component look at:
- /apps/frontend/src/app/colors.scss
- /apps/frontend/src/app/global.scss
- /apps/frontend/tailwind.config.cjs

All the --color-custom* are deprecated, don't use them.

Check other components in the system before writing one, to get the right design.

When working on the backend we need to pass the 3 layers:
DTO >> Controller >> Service >> Repository (no shortcuts)
In some cases we will have
DTO >> Controller >> Manager >> Service >> Repository.

Most of the server logic should be inside libraries/nestjs-libraries.
The backend app is mostly used to write controllers that import from the libraries.

For the frontend follow this:
- Many of the UI components live in /apps/frontend/src/components/ui
- Routing is in /apps/frontend/src/app
- Components are in /apps/frontend/src/components
- Always use SWR to fetch data, and use the "useFetch" hook from /libraries/helpers/src/utils/custom.fetch.tsx

When using SWR, each one has to be in a separate hook and must comply with react-hooks/rules-of-hooks, never put eslint-disable-next-line on it.

This is valid:
const useCommunity = () => {
   return useSWR....
}

This is not valid:
const useCommunity = () => {
  return {
    communities: () => useSWR<CommunitiesListResponse>("communities", getCommunities),
    providers: () => useSWR<ProvidersListResponse>("providers", getProviders),
  };
}

- Linting of the project can run only from the root.
- Use only pnpm.
- Never use raw SQL queries, always use Prisma.
- Changes must not break existing data. If a change affects stored data, a migration may be needed; ask first.
- Avoid creating new files with pure algorithm logic.
- New code should look like similar code elsewhere in the project; don't introduce new patterns.
- After finishing a change, have another agent compare the new code with the existing code to check it follows the same patterns.
- Temporal workflows that are already deployed must not be changed in place: create a new versioned workflow and update every caller.
- Temporal activity parameters cannot be changed: create a new activity and a new workflow that uses it.
- Code must stay generic. Provider-specific logic (e.g. Facebook, Instagram) belongs in that provider's implementation, exposed through the provider interface; never `if (facebookProvider) {}` in generic code.
- Before adding a field to a shared repository/service `select` or changing a shared method's return shape, grep for all its consumers (frontend, public API, MCP/agent tools, orchestrator, webhooks) and confirm the change is intended for each.
- Exposing a stored field to a new external surface (public API, MCP, webhooks) is a data-exposure decision: ask first.
- Never silently change the meaning or format of a value persisted in an existing DB column; ask first.
- Never return a raw Prisma row from a model that holds credentials (`Integration`, `User` and similar) in a controller response. Repository writes on those models must use a `select` with only the fields the caller needs, or the controller returns nothing.
- Code invoked by webhooks of external systems (payment providers) must not throw: wrap any call that can fail so a failure is caught and logged.
