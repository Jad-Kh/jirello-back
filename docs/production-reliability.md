# Production reliability patterns

The `/learning` routes make failure modes easy to trigger and inspect, but the application does not rely on those routes for correctness. The same patterns protect real Jirello workflows as follows.

| Principle                   | Production implementation                                                                                                                                                                                      | Protected behavior                                                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Multi-document transactions | Community, project, role, task, work, calendar, time, portal, invitation, notification, and collaboration mutations use `runInTransaction`. Business writes and realtime outbox writes share the session.      | Related documents and their durable realtime events commit or roll back together.                                                                            |
| Database uniqueness         | Unique indexes cover user email/username, community name/flag, project name within a community, role title within a community, pending invitations, active timers, portal access, and other domain invariants. | Concurrent requests cannot both create a value that must be unique. Duplicate-key errors become HTTP `409`.                                                  |
| Optimistic concurrency      | Task, work-configuration, time-entry, deliverable, collaboration-message, and calendar updates filter by both `_id` and `version`, then increment `version` in the same update.                                | A stale client cannot overwrite a newer update between a read and write.                                                                                     |
| Pagination                  | Legacy collection endpoints retain offset pagination. Notifications use an opaque `(createdAt, _id)` cursor and the matching `{ recipientId, createdAt, _id }` index.                                          | Offset remains useful for page numbers; cursor traversal stays stable and avoids deep `skip` work.                                                           |
| Indexes                     | Examples include task board `{ projectId, status, position }`, notification feed `{ recipientId, createdAt, _id }`, and calendar range indexes.                                                                | Read latency improves for real filter/sort shapes at the cost of index storage and additional write maintenance.                                             |
| Idempotency                 | `POST /tasks` accepts `Idempotency-Key`, stores a request hash, and enforces `{ projectId, users.createdBy, idempotencyKey }` uniqueness.                                                                      | An identical retry returns the original task; key reuse with a different body returns `409`; concurrent duplicates are resolved by MongoDB.                  |
| Redis cache-aside           | `GET /work/configurations` checks Redis, falls through to MongoDB, and writes a 60-second cache entry. Mutations increment a namespace version after commit.                                                   | Repeated configuration reads avoid MongoDB, and old entries become unreachable immediately after create/update/archive. Redis failures fail open to MongoDB. |
| Background queue            | Password recovery stores the reset token and enqueues SMTP delivery in BullMQ. A worker performs delivery with retries and exponential backoff.                                                                | The HTTP request does not wait for SMTP, and transient delivery failures are retried outside the request.                                                    |
| Observability               | Work-configuration reads log access/cache/database/total timing; password recovery logs database/queue/total timing; calendar reads log database/worker/total timing. All include the request ID.              | Logs identify which subsystem consumed the request time without logging reset tokens or passwords.                                                           |
| CPU-bound work              | Calendar recurrence expansion for event and availability reads runs in a worker thread.                                                                                                                        | Large recurrence calculations no longer block the main Node event loop from serving unrelated HTTP requests.                                                 |

## Transaction proof

`test/integration/database.integration.test.ts` deliberately throws after the real community workflow has inserted a community and updated its owner's `ownedCommunityIds`. It then verifies that neither change survived. The suite also races two task inserts with the same idempotency key and verifies that exactly one document exists.

Run those destructive integration checks only against a disposable database:

```powershell
$env:TEST_MONGO_URI = "mongodb://localhost:27018/jirello_integration?replicaSet=rs0"
npm run test:integration
```

The integration suite drops the database named in `TEST_MONGO_URI` before and after the run.

## Learning lab's role

The Engineering Lab remains useful because it lets a developer force rollback, compare offset and cursor behavior, inspect cache hits, and compare synchronous versus worker CPU work from the UI. It is an observability and teaching surface; the table above identifies the production code that provides the actual resilience.
