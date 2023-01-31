import { authRoutes } from "./authRoutes.js";

const router = (app) => {
    app.use("/auth", authRoutes);
}

export {
    router
}