# Jirello realtime client guide

Pusher Channels is the only WebSocket transport. REST remains the command and snapshot API; MongoDB remains the system of record. A client must never treat receipt of a Pusher event as proof that a write succeeded.

## Pusher dashboard

Create one Channels application per environment. Enable Force TLS, Authorized Connections, client events, and batch webhooks. Configure the webhook URL as `https://api.example.com/realtime/webhooks/pusher`. Never expose the app secret.

Set the server environment variables from `.env.example`. `PUSHER_KEY` and `PUSHER_CLUSTER` are public connection data; the app ID and secret are server-only.

## Browser setup

Install `pusher-js`, load the public configuration using the Jirello access token, and use the same token for Pusher user and channel authorization:

```ts
import Pusher from "pusher-js";

const accessToken = getAccessToken();
const configuration = await fetch("/realtime/config", {
    headers: { Authorization: `Bearer ${accessToken}` },
}).then((response) => response.json());

const authorizationHeaders = () => ({
    Authorization: `Bearer ${getAccessToken()}`,
});

const pusher = new Pusher(configuration.data.key, {
    cluster: configuration.data.cluster,
    forceTLS: configuration.data.forceTLS,
    userAuthentication: {
        endpoint: "/realtime/user-auth",
        transport: "ajax",
        headersProvider: authorizationHeaders,
    },
    channelAuthorization: {
        endpoint: "/realtime/channel-auth",
        transport: "ajax",
        headersProvider: authorizationHeaders,
    },
});

pusher.signin();
```

Subscribe only after the REST snapshot has loaded:

```ts
const userChannel = pusher.subscribe(`private-user-${userId}`);
const communityChannel = pusher.subscribe(`private-community-${communityId}`);
const projectChannel = pusher.subscribe(`private-project-${projectId}`);
const presenceChannel = pusher.subscribe(`presence-project-${projectId}`);

projectChannel.bind("task-updated-v1", handleRealtimeEnvelope);
userChannel.bind("notification-created-v1", handleRealtimeEnvelope);
```

The server rejects subscriptions unless the authenticated user is allowed to read the resource. Presence member data contains only the user ID, username, and display name.

`private-project-*` carries the complete shared project stream and therefore requires `READ_OTHER` project permission. `presence-project-*` accepts either project read permission because it carries only ephemeral collaboration signals. Task events are also delivered to each assignee's private user channel, so restricted users can receive their own task changes without gaining access to the whole project stream.

## Server event catalog

- Personal: `notification-created-v1`, `notification-read-v1`, `notifications-read-all-v1`, `notification-preferences-updated-v1`, `conversation-read-v1`
- Invitations and membership: `community-invitation-created-v1`, `community-invitation-accepted-v1`, `community-invitation-declined-v1`, `community-member-added-v1`, `community-member-removed-v1`
- Community and roles: `community-created-v1`, `community-updated-v1`, `community-permissions-updated-v1`, `role-created-v1`, `role-updated-v1`, `role-assigned-v1`, `role-removed-v1`
- Projects and tasks: `project-created-v1`, `project-updated-v1`, `community-project-added-v1`, `community-project-removed-v1`, `task-created-v1`, `task-updated-v1`, `task-moved-v1`, `tasks-reordered-v1`, `task-deleted-v1`
- Collaboration: `chat-message-created-v1`, `chat-message-updated-v1`, `chat-message-deleted-v1`, `comment-created-v1`, `comment-updated-v1`, `comment-deleted-v1`, `message-reported-v1`
- Ephemeral client events: `client-typing`, `client-cursor`

## Commands and sender exclusion

All durable changes still use REST. Include the active socket ID so the server can exclude the initiating tab from the matching broadcast:

```ts
await fetch(`/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
        "X-Pusher-Socket-Id": pusher.connection.socket_id,
    },
    body: JSON.stringify({ version: task.version, status: "done" }),
});
```

Use the HTTP response to update the initiating UI. Other devices receive the Pusher event.

## Typing and cursors

Typing and cursor positions are ephemeral Pusher client events. They are allowed only on authorized private/presence channels and must never change business state:

```ts
presenceChannel.trigger("client-typing", {
    projectId,
    conversationId,
    typing: true,
});

presenceChannel.trigger("client-cursor", {
    projectId,
    surface: "board",
    x: 0.42,
    y: 0.18,
});
```

Debounce cursor updates, expire typing state locally after a few seconds, and never include message content or private profile data. Pusher applies its client-event rate limit; the UI should stay well below it.

## Event handling and recovery

Every server event uses this envelope:

```ts
type RealtimeEnvelope = {
    eventId: string;
    eventType: string;
    occurredAt: string;
    actorId?: string;
    aggregate: { type: string; id: string; version: number };
    data: Record<string, unknown>;
};
```

Keep a bounded set of processed `eventId` values. Ignore duplicates and aggregate versions older than the local version. If a version is skipped, an event cannot be applied, or Pusher reconnects, reload the affected REST snapshot. Pusher is not used as event history.

Unsubscribe from project channels when leaving the project. On logout, call `pusher.disconnect()`; the backend also revokes Pusher user connections. A password reset or community access removal terminates active Pusher connections and forces authorization again.

## Durable feature endpoints

- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`
- `GET /invitations`, `POST /invitations`, `POST /invitations/:id/respond`
- `GET /tasks/project/:projectId`, `POST /tasks`, `PATCH /tasks/:id`, `PATCH /tasks/reorder`, `DELETE /tasks/:id`
- `GET|POST /collaboration/messages`, `PATCH|DELETE /collaboration/messages/:id`
- `POST /collaboration/messages/:id/report`, `GET /collaboration/reports`, `PATCH /collaboration/reports/:id`
- `POST /collaboration/read`

Chat, comments, tasks, invitations, notification state, and read cursors are stored in MongoDB. Only presence, typing, and cursor state are intentionally ephemeral.

## Operations

Business writes and realtime outbox records commit in the same MongoDB transaction. The publisher retries failed Pusher calls with exponential backoff and moves an event to `dead` after eight attempts. Administrators can inspect `GET /realtime/outbox/dead` and retry an event through `POST /realtime/outbox/:eventId/retry`.

Monitor `jirello_realtime_events_published_total`, `jirello_realtime_events_failed_total`, Pusher concurrent connections, daily delivered messages, authorization failures, and dead-letter count. Alert before reaching the Pusher plan limits.
