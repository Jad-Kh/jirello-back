# Multi-instance runtime and production rollout

## Runtime topology

Every container uses the same immutable image. `PROCESS_ROLE` decides which work it owns:

| Role            | Business API | BullMQ consumers     | Repeatable scans                | Pusher outbox |
| --------------- | ------------ | -------------------- | ------------------------------- | ------------- |
| `api`           | Yes          | No                   | No                              | No            |
| `queue-worker`  | No           | Email and order jobs | No                              | No            |
| `scheduler`     | No           | Scheduled scan jobs  | Calendar and deadline schedules | No            |
| `outbox-worker` | No           | No                   | No                              | Yes           |
| `all`           | Yes          | Yes                  | Yes                             | Yes           |

`all` exists for a convenient local `npm run dev`. Production validation rejects
that role so an omitted setting cannot accidentally start every worker in every API
pod. Production must use one of the four dedicated roles. JWT authentication is
stateless, so API requests do not require sticky sessions. Redis holds shared
rate-limit counters, caches, BullMQ state, and repeatable schedules.

The old per-process timers are gone. Scheduler replicas idempotently upsert the same BullMQ job scheduler IDs. BullMQ allows only one worker to claim a given job, so scheduler replicas can overlap during rolling updates without running a scan once per Node process.

## Readiness and failure behavior

`GET /health/live` only proves that the Node event loop and HTTP listener are alive. `GET /health/ready` checks:

- application initialization completed;
- Mongoose is connected;
- the mandatory shared Redis client answers `PING`;
- BullMQ can execute a queue operation;
- a worker-bearing role finished creating its workers and schedules.

An API role reports worker readiness as `not-required`. A Redis outage makes every role unready because rate limiting, queues, and cache correctness depend on it. Liveness deliberately remains healthy during a dependency outage, allowing Kubernetes to remove the pod from service without creating a restart storm. Startup fails when mandatory dependencies cannot initialize, and Kubernetes restarts the container.

Worker-only roles expose only health and metrics endpoints. They do not expose business routes.

## At-least-once delivery and duplicate protection

BullMQ and the Pusher outbox provide at-least-once processing. A process may complete an external side effect and crash before acknowledging it, so consumers still need idempotency:

- password reset jobs use a SHA-256-derived job ID based on email and token;
- order confirmation jobs use the order ID;
- deadline notifications use a database-unique deduplication key;
- calendar reminder deliveries have a unique delivery record and deterministic SMTP Message-ID;
- outbox events have unique event IDs, atomic claims, expiring leases, and `lockedBy` ownership checks. A stale worker cannot acknowledge a lease reclaimed by another worker;
- order creation retains its endpoint idempotency record and unique database constraint.

The outbox lease prevents concurrent publication but cannot give exactly-once behavior across MongoDB and Pusher. Consumers of realtime events should retain the `eventId` and ignore one already applied.

## Infrastructure availability

The Compose MongoDB replica set and Redis container are development dependencies, not production HA.

For production:

1. Use a managed MongoDB replica set with at least three voting members spread across zones, TLS, point-in-time recovery, automated backups, tested restores, and alerts for replication lag and connection saturation.
2. Use managed Redis with TLS, authentication, automatic primary failover, replicas across zones, persistence appropriate to the recovery objective, eviction disabled or isolated capacity for BullMQ, and alerts for memory, latency, rejected connections, and failovers.
3. Keep MongoDB and Redis in the same region as Kubernetes with private networking and narrowly scoped credentials.
4. Use separate environments or logical Redis prefixes/clusters so staging cannot consume production jobs.
5. Spread application replicas across nodes and zones. The supplied topology constraints and disruption budgets keep capacity during node maintenance.

NGINX Gateway Fabric owns the public `LoadBalancer` Service and distributes traffic
across stateless API pods through the internal `jirello-api` `ClusterIP` Service.
The Gateway terminates TLS, redirects HTTP to HTTPS, and applies request-body and
upstream timeout policies. Configure provider-specific load-balancer annotations in
an environment overlay and put a CDN or WAF in front where appropriate.

## Local multi-instance operation

```bash
docker compose up --build
docker compose up --scale api=3
```

Nginx listens on `http://localhost:8082` and load-balances the API service replicas. MongoDB is exposed on host port 27018 and Redis on 6379 for local inspection. Run the one-shot migration and index sequence explicitly:

```bash
docker compose --profile tools run --rm database-deploy
```

## Kubernetes deployment

The resources under `k8s/` include:

- three API replicas behind an internal `ClusterIP` Service;
- an NGINX Gateway Fabric `Gateway`, HTTPS `HTTPRoute`, HTTP-to-HTTPS redirect,
  client-body limit, and upstream timeout policies;
- two replicas for each worker role;
- startup, readiness, and liveness probes;
- zero-unavailable rolling updates, topology spreading, resource requests/limits, and non-root read-only containers;
- a disruption budget for every role;
- API and queue-worker HPAs;
- a one-shot database migration/index Job;
- ingress NetworkPolicies;
- optional Prometheus Operator discovery.

Prepare a real Secret without committing it:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl -n jirello create secret generic jirello-secrets \
  --from-literal=MONGO_CONNECT_URI='mongodb+srv://...' \
  --from-literal=REDIS_URL='rediss://...' \
  --from-literal=JWT_SECRET='...' \
  --from-literal=JWT_ACCESS_SECRET='...' \
  --from-literal=JWT_REFRESH_SECRET='...' \
  --from-literal=METRICS_TOKEN='...' \
  --from-literal=SMTP_HOST='...' \
  --from-literal=SMTP_FROM='...' \
  --from-literal=PUSHER_APP_ID='...' \
  --from-literal=PUSHER_KEY='...' \
  --from-literal=PUSHER_SECRET='...' \
  --from-literal=PUSHER_CLUSTER='...'
```

Include any SMTP authentication values your provider needs. Copy `k8s/secret.example.yaml` into a secure secret manager workflow rather than applying its placeholders. Change the image in `k8s/kustomization.yaml`, then follow [the NGINX Gateway deployment guide](nginx-gateway.md) to install the controller, create the TLS Secret, update the hostname, and render the manifests.

The database Job deliberately performs the backward-compatible data migration before index synchronization. Run it once and wait for success before deploying application workloads:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/service-account.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/database-deploy-job.yaml
kubectl -n jirello wait --for=condition=complete job/jirello-database-deploy --timeout=15m
kubectl apply -k k8s
kubectl -n jirello rollout status deployment/jirello-api
```

In a real delivery pipeline, apply the Job from a migration stage and remove or generate a versioned Job name before the later `apply -k`. Kubernetes Job names are immutable and completed Jobs do not rerun merely because they are applied again.

## Metrics, logs, and alerts

Pino logs are structured JSON and include `service`, `instanceId`, `processRole`, request ID, job ID where applicable, and error context. Do not aggregate multiline console output; ingest JSON fields.

Every role exposes `/metrics`. Metrics include Node/process defaults, HTTP latency, dependency readiness, Pusher outbox pending/dead counts, publication successes/failures, and endpoint-specific timing already present in the application. The optional ServiceMonitor expects a `jirello-metrics-token` Secret in the `monitoring` namespace; its value must equal the application `METRICS_TOKEN`.

At minimum, alert on:

- no ready API replicas or no ready replica for a worker role;
- sustained 5xx/429 rate and p95/p99 HTTP latency;
- MongoDB or Redis readiness failures, latency, failovers, replication lag, and exhausted connections;
- BullMQ failed/stalled jobs and growing waiting/active age;
- nonzero dead outbox events or a steadily growing pending outbox;
- container restarts, OOM kills, HPA saturation, and disruption budget violations.

Use dashboards grouped by role and Kubernetes pod. Keep `instanceId` for drill-down rather than long-term high-cardinality aggregation.

## Sensible rollout

1. Validate the release in staging with production-like MongoDB/Redis topology and concurrent API/worker replicas.
2. Run unit, integration, migration, index, load, dependency-failure, and graceful-shutdown tests.
3. Confirm a fresh backup and a recent restore drill before changing production data.
4. Deploy backward-compatible schema changes first. Never require new code and destructive data changes in the same irreversible step.
5. Run the database Job exactly once and inspect its logs and MongoDB metrics.
6. Roll out one API canary and one worker replica. Watch errors, latency, queue failures, Redis memory, outbox backlog, and duplicate side effects.
7. Continue the zero-unavailable rolling update, then allow the HPA to expand normally.
8. Verify readiness for every role, exercise sign-in and representative writes, and wait for queues/outbox to drain.
9. Roll back the image if application health regresses. Treat data rollback as a separate rehearsed procedure; never assume an image rollback reverses a migration.
10. After the observation window, remove old images and compatibility code only in a later release.
