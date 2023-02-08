import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";

const router = (app) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
}

export {
    router
}