import { Permissions } from "./permissions.js";

const PERMISSIONS_MAP = {
    // Auth Routes
    "/sign-up": { POST: { domain: "users", permissions: [] } },
    "/log-in": { POST: { domain: "users", permissions: [] } },
    "/recovery-email": { GET: { domain: "users", permissions: [] } },
    "/refresh-token": { POST: { domain: "users", permissions: [] } },
    "/log-out": { POST: { domain: "users", permissions: [] } },

    // Community Routes
    "/create-community": { POST: { domain: "projects", permissions: [Permissions.CREATE_OTHER] } },
    "/update-community/:id": {
        PUT: (req) => ({
            domain: "projects",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.EDIT_OWN]
                : [Permissions.EDIT_OTHER]
        })
    },
    "/add-user-to-community": { PUT: { domain: "roles", permissions: [Permissions.CHANGE_OTHER] } },
    "/remove-user-from-community": { PUT: { domain: "roles", permissions: [Permissions.CHANGE_OTHER] } },
    "/add-project-to-community": { PUT: { domain: "projects", permissions: [Permissions.CHANGE_OTHER] } },
    "/remove-project-from-community": { PUT: { domain: "projects", permissions: [Permissions.CHANGE_OTHER] } },
    "/update-community-permissions/:id": {
        PUT: (req) => ({
            domain: "projects",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.EDIT_OWN]
                : [Permissions.EDIT_OTHER]
        })
    },
    "/get-user-communities/:id": {
        GET: (req) => ({
            domain: "projects",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.READ_OWN]
                : [Permissions.READ_OTHER]
        })
    },
    "/get-user-communities-paginated/:id": {
        GET: (req) => ({
            domain: "projects",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.READ_OWN]
                : [Permissions.READ_OTHER]
        })
    },

    // Project Routes
    "/create-project": { POST: { domain: "projects", permissions: [Permissions.CREATE_OTHER] } },
    "/update-project/:id": {
        PUT: (req) => ({
            domain: "projects",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.EDIT_OWN]
                : [Permissions.EDIT_OTHER]
        })
    },
    "/get-projects-of-community/:id": { GET: { domain: "projects", permissions: [Permissions.READ_OTHER] } },
    "/get-projects-of-community-paginated/:id": { GET: { domain: "projects", permissions: [Permissions.READ_OTHER] } },

    // Role Routes
    "/create-role": { POST: { domain: "roles", permissions: [Permissions.CREATE_OTHER] } },
    "/update-role": {
        PUT: (req) => ({
            domain: "roles",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.EDIT_OWN]
                : [Permissions.EDIT_OTHER]
        })
    },
    "/assign-role-to-user": { PUT: { domain: "roles", permissions: [Permissions.CHANGE_OTHER] } },
    "/remove-user-from-role": { PUT: { domain: "roles", permissions: [Permissions.CHANGE_OTHER] } },
    "/get-community-roles/:id": { GET: { domain: "roles", permissions: [Permissions.READ_OTHER] } },
    "/get-community-roles-paginated/:id": { GET: { domain: "roles", permissions: [Permissions.READ_OTHER] } },
    "/get-community-role-hierarchy/:id": { GET: { domain: "roles", permissions: [Permissions.READ_OTHER] } },

    // User Routes
    "/get-user-by-id/:id": {
        GET: (req) => ({
            domain: "users",
            permissions: req.user._id.toString() === req.params.id
                ? [Permissions.READ_OWN]
                : [Permissions.READ_OTHER]
        })
    },
    "/get-user-by-email/:email": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } },
    "/get-user-by-username/:id": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } },
    "/get-users-of-community/:id": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } },
    "/get-users-of-community-paginated/:id": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } },
    "/get-users-of-role/:id": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } },
    "/get-users-of-role-paginated/:id": { GET: { domain: "users", permissions: [Permissions.READ_OTHER] } }
};

export {
    PERMISSIONS_MAP
};