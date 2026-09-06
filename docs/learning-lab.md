# Node, MongoDB, Redis, and Vue learning lab

The Engineering Lab in `jirello-ui` uses one order-processing workflow to make the concepts observable instead of implementing disconnected examples.

## What each experiment demonstrates

### Multi-document transaction

`POST /learning/transaction` writes a `LabOrder` and a related `LabLedgerEntry` in one MongoDB transaction. With `failAfterFirstWrite: true`, it throws after the order insert and then queries both collections to prove neither write survived.

MongoDB transactions apply all changes or discard all changes. They are appropriate here because two collections must agree, but they cost more than a single-document write, so embedding remains preferable when the data naturally belongs in one aggregate.

### Unique constraints and idempotency

The database owns these constraints:

- `{ userId, clientReference }` is unique.
- `{ userId, idempotencyKey }` is unique.
- `orderNumber` is unique.
- Each ledger permits only one entry for an order.

`POST /learning/orders` does not run `SELECT` before `INSERT`. It attempts the transactional insert and handles MongoDB error `E11000`. The idempotency key is stored with a hash of the validated request. Repeating the same key/body returns the existing order; reusing the key with a different body returns `409`.

This protects races because competing application instances cannot both defeat a database unique index.

### Optimistic concurrency

`PATCH /learning/orders/:id` uses one `findOneAndUpdate` whose filter contains `_id`, `userId`, and `version`. The same atomic operation applies the change and increments `version` with `$inc`. If no document matches, the API distinguishes missing data from a stale version and returns `409` for the latter.

The important property is that version checking and mutation are not separate operations.

### Offset and cursor pagination

`GET /learning/orders` supports:

- `mode=offset&page=3&limit=10`: simple numbered pages using `skip` and `limit`.
- `mode=cursor&cursor=...&limit=10`: an opaque cursor containing the last `createdAt` and `_id`, followed by an indexed range query.

Offset pagination is useful when users need arbitrary page numbers. Its deep-page cost grows because MongoDB must scan past the offset. Cursor pagination cannot jump directly to page 40, but its range boundary lets the index resume near the next result and remains steadier as the collection grows.

### Index and its tradeoff

The list query filters by `userId` and sorts by `createdAt DESC, _id DESC`, so the model defines `{ userId: 1, createdAt: -1, _id: -1 }`. `GET /learning/orders/index-explain` exposes the selected index, keys examined, documents examined, returned documents, and execution time.

The tradeoff is extra disk/memory plus additional index maintenance on every insert, update, and delete. The equality field comes first, followed by the fields that provide the sort order.

### Redis cache-aside

`GET /learning/orders/:id` follows cache hit → cache miss → MongoDB → Redis with a 60-second TTL. Cache keys include both user and order IDs. A successful `PATCH` deletes that key, so the next read misses and repopulates it.

### Background queue

Creating a new order adds an order-confirmation job to BullMQ in Redis. The HTTP request only waits for the durable enqueue, while a worker simulates the non-critical external delivery. `GET /learning/jobs/:jobId` exposes waiting, active, completed, or failed state.

### Observability

Order creation logs request ID, user ID, order ID, replay status, and validation/database/queue timings as structured Pino fields. Reads separately time Redis, MongoDB, and the total endpoint. This makes the slow subsystem visible in logs.

### CPU-bound work

`GET /learning/cpu/sync` deliberately counts primes on the main event loop. `GET /learning/cpu/worker` runs the same function through `node:worker_threads`. Both return the same result, but the worker version allows the main Node event loop to continue serving other requests. Creating a worker per request has overhead; production CPU workloads normally use a worker pool.

## Run it

```powershell
cd D:\Coding\Projects\jirello-back
docker compose up -d mongo redis
npm run dev
```

In another terminal:

```powershell
cd D:\Coding\Projects\jirello-ui
npm run dev
```

Sign in as the seeded demo user, open **Engineering lab** in the sidebar, and work through the cards from top to bottom.

## Primary references

- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)
- [MongoDB atomicity and expected-value filters](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [MongoDB unique indexes](https://www.mongodb.com/docs/manual/core/index-unique/)
- [MongoDB skip versus range pagination](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/)
- [MongoDB Equality, Sort, Range index guideline](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/)
- [Redis cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [BullMQ queues](https://docs.bullmq.io/guide/queues/) and [workers](https://docs.bullmq.io/guide/workers/)
- [Node.js worker threads](https://nodejs.org/api/worker_threads.html)
