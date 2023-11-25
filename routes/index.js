import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { communityRoutes } from "./communityRoutes.js";
import { projectRoutes } from "./projectRoutes.js";
import { roleRoutes } from "./roleRoutes.js";

const router = (app) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/community", communityRoutes);
    app.use("/project", projectRoutes);
    app.use("/role", roleRoutes);
}

export {
    router
}