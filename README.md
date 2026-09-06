# Jirello API

TypeScript REST and realtime API for Jirello communities, projects, roles, tasks, collaboration, notifications, and users. It runs on Express, MongoDB through Mongoose, and Pusher Channels.

## Requirements

- Node.js 22 or newer
- MongoDB 6 or newer, or a MongoDB Atlas connection
- Redis 7 or newer (mandatory for rate limiting, caching, and BullMQ)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

On PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env
```

The default server address is `http://localhost:8082`. Use `GET /health/live` for
process liveness and `GET /health/ready` for application, MongoDB, Redis, BullMQ,
and role-specific worker readiness.

## Commands

| Command                 | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | Run the API with TypeScript watch mode                 |
| `npm run typecheck`     | Check all production TypeScript without emitting files |
| `npm test`              | Run the unit and HTTP integration suite once           |
| `npm run test:watch`    | Run tests interactively                                |
| `npm run lint`          | Run Biome static analysis                              |
| `npm run format:check`  | Verify repository formatting                           |
| `npm run build`         | Clean and compile production files into `dist/`        |
| `npm start`             | Run the compiled production entry point                |
| `npm run db:indexes`    | Create declared indexes after a production build       |
| `npm run db:migrate`    | Migrate legacy task fields needed by realtime features |
| `npm run db:deploy`     | Run migrations and then synchronize indexes once       |
| `npm run db:seed:scale` | Generate deterministic, production-scale local data    |
| `npm run check`         | Run the complete local verification suite              |

## Authentication

Access tokens are sent as `Authorization: Bearer <token>`. Refresh tokens are rotated and stored in an `HttpOnly`, `SameSite=Strict` cookie scoped to `/auth`. Only a SHA-256 digest of the active refresh token is stored in MongoDB.

Community-scoped endpoints also require the `activeCommunityId` header unless their community ID is already part of the validated request. Authorization checks membership before evaluating owner, role, or default-community permissions.

## API routes

| Prefix           | Available operations                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `/auth`          | Sign up, log in, refresh, log out, recovery status                                               |
| `/communities`   | Create/update communities, permissions, membership, project links, and list a user's communities |
| `/projects`      | Create/update projects and list community projects                                               |
| `/roles`         | Create/update roles, assign/remove users, and list community roles                               |
| `/users`         | Resolve users and list users by community or role                                                |
| `/tasks`         | Durable project tasks and live board operations                                                  |
| `/notifications` | Personal durable notifications and read state                                                    |
| `/invitations`   | Community invitation lifecycle                                                                   |
| `/collaboration` | Persistent chat, comments, mentions, and read cursors                                            |
| `/realtime`      | Pusher configuration, connection/channel authorization, and outbox administration                |

Responses use the shape:

```json
{
    "code": 200,
    "message": "Operation completed.",
    "data": {}
}
```

Password recovery uses a single-use random token whose SHA-256 digest and expiration are stored with the user. Configure the SMTP variables from `.env.example`; production startup rejects missing mail configuration. Recovery requests always return the same `202` response and never reveal whether an account exists.

The OpenAPI 3.1 contract is available from `GET /openapi.json`.

Pusher Channels is the only WebSocket transport. MongoDB remains authoritative and REST remains the command/snapshot API. See [the realtime client and operations guide](docs/realtime.md) for frontend setup, channel rules, event contracts, typing/cursor events, recovery behavior, and deployment configuration.

See [production reliability patterns](docs/production-reliability.md) for the real endpoints using transactions, uniqueness, optimistic concurrency, cursor pagination, indexes, idempotency, Redis, queues, structured timing, and worker threads. The Engineering Lab is the interactive demonstration surface, not the sole implementation.

## Architecture

Routes compose the same middleware sequence:

1. Access-token authentication
2. Joi request validation and normalization
3. Resource-scoped membership and permission authorization
4. Feature handler and database query
5. Sanitizing response presenter
6. Shared response forwarding

Application construction and server startup are separate. Tests can exercise the complete HTTP application or inject an isolated database startup dependency without connecting to production data.

Production uses one image with dedicated `api`, `queue-worker`, `scheduler`, and
`outbox-worker` process roles. Redis-backed rate limits are consistent across API
replicas, repeatable BullMQ jobs replace in-process timers, and worker-only roles do
not expose the business API. See [the multi-instance operations guide](docs/multi-instance.md)
for topology, Kubernetes, HA dependencies, metrics, failure semantics, and rollout.
The production ingress path uses NGINX Gateway Fabric and Kubernetes Gateway API;
see [the NGINX Gateway deployment guide](docs/nginx-gateway.md) for installation,
TLS, DNS, and verification.

## Security defaults

- Explicit CORS allowlist with credentials support
- Helmet security headers and disabled Express signature header
- 1 MB default JSON body limit
- 30-second request timeout
- HS256 tokens with enforced token type, subject, expiry, and unique token IDs
- Rotating refresh tokens with constant-time digest comparison
- Unique database indexes for user identity and scoped project/role names
- Validation errors do not expose stack traces in production
- Authentication/recovery throttling and a broader API rate limit
- Correlation IDs and structured JSON logs with secret redaction
- Prometheus runtime/request metrics and optional Sentry error delivery
- Transactions for paired community, project, and role relationship writes
- Transactional Pusher outbox with retry and dead-letter administration
- Private user/community/project channels and project presence channels
- Durable invitations, notifications, tasks, chat/comments, mentions, unread state, and deadline reminders

Run `npm audit` when updating dependencies. The current dependency tree audits with zero known vulnerabilities.

## Deployment and operations

`docker compose up --build` starts a load-balanced API, dedicated worker roles,
a single-node MongoDB replica set, and Redis for development. Scale local API
instances with `docker compose up --scale api=3`. Transactions require MongoDB
to use a replica set or sharded cluster.

CI runs linting, formatting, type checking, unit/HTTP tests, real MongoDB integration tests, the production build, and a production dependency audit. Locally, the integration suite runs when `TEST_MONGO_URI` points to a disposable replica-set database.

## Production-scale local data

The normal `db:seed` command keeps the small three-account demo. The separate
`db:seed:scale` command generates deterministic, relationship-aware data in
bounded batches for pagination, index, rendering, and load testing.

Available profiles are `tiny`, `small`, `medium`, and `large`. The large
profile creates 10,000 users, 1,000 projects, 250,000 tasks, 1,000,000 messages,
1,500,000 notifications, 500,000 time entries, and related planning and portal
records. It is intentionally not the default.

Run a Docker seed with:

```powershell
$env:SEED_PROFILE = "small"
$env:SEED_RANDOM_STATE = "20260903"
$env:SEED_ANCHOR = "2026-09-03"
docker compose --profile tools run --rm scale-seed
```

Use `--reset` with the npm command to replace only the matching seed run:

```powershell
$env:ALLOW_SCALE_SEED = "true"
npm run db:seed:scale -- --profile=tiny --seed=20260903 --anchor=2026-09-03 --reset
```

Every generated document carries an internal `_seed.runId` marker written by
the native MongoDB collection API. Cleanup therefore targets one run instead of
dropping the database. The command refuses to run in production, requires the
explicit `ALLOW_SCALE_SEED=true` opt-in, and restricts remote databases unless
`ALLOW_REMOTE_SCALE_SEED=true` is also explicitly supplied.

Generated accounts share `SCALE_SEED_PASSWORD`, which defaults locally to
`JirelloScale123!`. The completion log prints the first owner and member
accounts for navigation.

After the production build, run `npm run db:deploy` exactly once before moving
traffic to the new version. It runs the migration and only then synchronizes
indexes. Review index changes before deployment; application replicas deliberately
do not synchronize indexes during startup.

Use MongoDB Atlas continuous backups or scheduled `mongodump` snapshots. Encrypt backups, retain copies in another account or region, and perform documented restore drills. Forward the JSON logs to an observability platform and alert on elevated 5xx, 401, 403, and 429 rates. Prometheus metrics are exposed at `GET /metrics`; production requires its bearer token. Set `SENTRY_DSN` to forward captured exceptions without including default personally identifiable information.

Graceful shutdown handles `SIGINT` and `SIGTERM`, stops accepting new requests, drains active requests, and disconnects MongoDB.
