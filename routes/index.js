import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { communityRoutes } from "./communityRoutes.js";
import { projectRoutes } from "./projectRoutes.js";

const router = (app) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/community", communityRoutes);
    app.use("/project", projectRoutes);
}

export {
    router
}