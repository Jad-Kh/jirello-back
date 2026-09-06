const bearerSecurity = [{ bearerAuth: [] }];

const jsonResponse = (description: string) => ({
    description,
    content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
});

const operation = (summary: string, secured = true, pathParameter?: string) => ({
    summary,
    ...(secured ? { security: bearerSecurity } : {}),
    ...(pathParameter
        ? {
              parameters: [{ name: pathParameter, in: "path", required: true, schema: { type: "string" } }],
          }
        : {}),
    responses: {
        "200": jsonResponse("Success"),
        "400": jsonResponse("Invalid request"),
        "401": jsonResponse("Unauthorized"),
        "403": jsonResponse("Forbidden"),
        "429": jsonResponse("Rate limited"),
    },
});

export const openApiDocument = {
    openapi: "3.1.0",
    info: {
        title: "Jirello API",
        version: "1.0.0",
        description:
            "REST and realtime API for configurable work, projects, time, finances, client portals, and calendars.",
    },
    servers: [{ url: "http://localhost:8082" }],
    paths: {
        "/health/live": { get: operation("Liveness check", false) },
        "/health/ready": {
            get: operation("Application, MongoDB, Redis, BullMQ, and role worker readiness check", false),
        },
        "/metrics": { get: operation("Prometheus metrics", false) },
        "/realtime/config": { get: operation("Load public Pusher connection configuration") },
        "/realtime/user-auth": { post: operation("Authenticate a Pusher user connection") },
        "/realtime/channel-auth": { post: operation("Authorize a private or presence channel") },
        "/realtime/webhooks/pusher": { post: operation("Receive signed Pusher webhooks", false) },
        "/auth/sign-up": { post: operation("Create an account", false) },
        "/auth/log-in": { post: operation("Log in", false) },
        "/auth/refresh-token": { post: operation("Rotate refresh token", false) },
        "/auth/log-out": { post: operation("Log out") },
        "/auth/recovery-email": { post: operation("Request password recovery", false) },
        "/auth/reset-password": { post: operation("Reset password", false) },
        "/communities/create-community": { post: operation("Create community") },
        "/communities/update-community/{id}": { put: operation("Update community", true, "id") },
        "/communities/update-community-permissions/{id}": {
            put: operation("Update community permissions", true, "id"),
        },
        "/communities/add-user-to-community": { put: operation("Add user to community") },
        "/communities/remove-user-from-community": { put: operation("Remove user from community") },
        "/communities/add-project-to-community": { put: operation("Link project to community") },
        "/communities/remove-project-from-community": { put: operation("Remove project from community") },
        "/communities/get-user-communities/{id}": { get: operation("List user communities", true, "id") },
        "/communities/get-user-communities-paginated/{id}": {
            get: operation("List user communities with pagination", true, "id"),
        },
        "/projects/create-project": { post: operation("Create project") },
        "/projects/update-project/{id}": { put: operation("Update project", true, "id") },
        "/projects/get-projects-of-community/{id}": { get: operation("List community projects", true, "id") },
        "/roles/create-role": { post: operation("Create role") },
        "/roles/update-role/{id}": { put: operation("Update role", true, "id") },
        "/roles/assign-role-to-user": { put: operation("Assign role") },
        "/roles/remove-user-from-role": { put: operation("Remove role assignment") },
        "/roles/get-community-roles/{id}": { get: operation("List community roles", true, "id") },
        "/users/get-user-by-id/{id}": { get: operation("Find user by ID", true, "id") },
        "/users/get-user-by-email/{email}": { get: operation("Find user by email", true, "email") },
        "/users/get-user-by-username/{username}": {
            get: operation("Find user by username", true, "username"),
        },
        "/users/get-users-of-community/{id}": { get: operation("List community users", true, "id") },
        "/users/get-users-of-community-paginated/{id}": {
            get: operation("List community users with pagination", true, "id"),
        },
        "/users/get-users-of-role/{id}": { get: operation("List role users", true, "id") },
        "/users/get-users-of-role-paginated/{id}": {
            get: operation("List role users with pagination", true, "id"),
        },
        "/notifications": {
            get: {
                ...operation("List personal notifications"),
                parameters: [
                    {
                        name: "cursor",
                        in: "query",
                        required: false,
                        description: "Opaque `(createdAt, _id)` cursor returned by the previous page.",
                        schema: { type: "string" },
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", minimum: 1, maximum: 100, default: 30 },
                    },
                ],
            },
        },
        "/notifications/{id}/read": { patch: operation("Mark a notification read", true, "id") },
        "/notifications/read-all": { patch: operation("Mark all notifications read") },
        "/notifications/preferences": { patch: operation("Update notification mute preferences") },
        "/tasks": {
            post: {
                ...operation("Create a project task"),
                parameters: [
                    {
                        name: "Idempotency-Key",
                        in: "header",
                        required: false,
                        description:
                            "Stable key for retrying one logical create request. Reuse with a different body returns 409.",
                        schema: { type: "string", maxLength: 128 },
                    },
                ],
            },
        },
        "/tasks/project/{projectId}": { get: operation("List project tasks", true, "projectId") },
        "/tasks/reorder": { patch: operation("Atomically reorder project tasks") },
        "/tasks/{id}": {
            patch: operation("Update or move a task", true, "id"),
            delete: operation("Delete a task", true, "id"),
        },
        "/collaboration/messages": {
            get: operation("List persistent chat messages or comments"),
            post: operation("Create a chat message or comment"),
        },
        "/collaboration/messages/{id}": {
            patch: operation("Edit a chat message or comment", true, "id"),
            delete: operation("Delete a chat message or comment", true, "id"),
        },
        "/collaboration/read": { post: operation("Update a conversation read cursor") },
        "/collaboration/messages/{id}/report": {
            post: operation("Report a chat message or comment", true, "id"),
        },
        "/collaboration/reports": { get: operation("List community message reports") },
        "/collaboration/reports/{id}": { patch: operation("Review a message report", true, "id") },
        "/invitations": {
            get: operation("List pending community invitations"),
            post: operation("Create a community invitation"),
        },
        "/invitations/{id}/respond": { post: operation("Accept or decline an invitation", true, "id") },
        "/realtime/outbox/dead": { get: operation("List dead-letter realtime events") },
        "/realtime/outbox/{eventId}/retry": {
            post: operation("Retry a dead-letter realtime event", true, "eventId"),
        },
        "/work/configurations": {
            get: operation("List work type configurations"),
            post: operation("Create a work type configuration"),
        },
        "/work/configurations/{id}": {
            patch: operation("Update a work type configuration", true, "id"),
            delete: operation("Archive a work type configuration", true, "id"),
        },
        "/work/templates": {
            get: operation("List work templates"),
            post: operation("Create a work template"),
        },
        "/work/templates/{id}": { delete: operation("Delete a work template", true, "id") },
        "/work/views": {
            get: operation("List saved work views"),
            post: operation("Create a saved work view"),
        },
        "/work/views/{id}": {
            patch: operation("Update a saved work view", true, "id"),
            delete: operation("Delete a saved work view", true, "id"),
        },
        "/time/entries": {
            get: operation("List time entries"),
            post: operation("Create a time entry or start a timer"),
        },
        "/time/entries/{id}": { patch: operation("Update an entry or stop a timer", true, "id") },
        "/time/entries/{id}/review": {
            post: operation("Approve or reject a submitted time entry", true, "id"),
        },
        "/time/timesheets/submit": { post: operation("Submit a timesheet range") },
        "/time/capacity": { get: operation("List community capacity") },
        "/time/capacity/{userId}": { put: operation("Configure member capacity", true, "userId") },
        "/time/workload": { get: operation("Load planned, tracked, and available workload") },
        "/finance/projects/{projectId}": {
            get: operation("Load project financial settings", true, "projectId"),
            put: operation("Configure project finances", true, "projectId"),
        },
        "/finance/projects/{projectId}/summary": {
            get: operation("Load project financial summary", true, "projectId"),
        },
        "/portal/public/{slug}": { get: operation("Load a public project status page", false, "slug") },
        "/portal/projects": { get: operation("List client projects") },
        "/portal/projects/{projectId}": { get: operation("Load a client portal", true, "projectId") },
        "/portal/projects/{projectId}/settings": {
            put: operation("Configure a client portal", true, "projectId"),
        },
        "/portal/projects/{projectId}/guests": {
            post: operation("Grant project guest access", true, "projectId"),
        },
        "/portal/guests/{id}": { delete: operation("Revoke guest access", true, "id") },
        "/portal/projects/{projectId}/deliverables": {
            post: operation("Create a client deliverable", true, "projectId"),
        },
        "/portal/deliverables/{id}": { patch: operation("Update or submit a deliverable", true, "id") },
        "/portal/deliverables/{id}/decision": {
            post: operation("Approve or request changes to a deliverable", true, "id"),
        },
        "/portal/projects/{projectId}/comments": {
            get: operation("List client-visible comments", true, "projectId"),
            post: operation("Create a client-visible comment or proofing annotation", true, "projectId"),
        },
        "/calendar/events": {
            get: operation("Load calendar events and task deadlines"),
            post: operation("Create a calendar event"),
        },
        "/calendar/calendars": {
            get: operation("List calendars"),
            post: operation("Create a personal or shared calendar"),
        },
        "/calendar/calendars/{id}": {
            patch: operation("Update a calendar", true, "id"),
            delete: operation("Archive a calendar", true, "id"),
        },
        "/calendar/events/{id}": {
            patch: operation("Update, move, or resize a calendar event", true, "id"),
            delete: operation("Delete a calendar event", true, "id"),
        },
        "/calendar/events/{id}/respond": { post: operation("Respond to a calendar invitation", true, "id") },
        "/calendar/events/{id}/occurrences": {
            patch: operation("Move or edit one recurring occurrence", true, "id"),
            delete: operation("Delete one recurring occurrence", true, "id"),
        },
        "/calendar/availability": { get: operation("Load personal or team busy intervals") },
    },
    components: {
        securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
        schemas: {
            ApiResponse: {
                type: "object",
                required: ["code", "message"],
                properties: { code: { type: "integer" }, message: { type: "string" }, data: {} },
            },
        },
    },
};
