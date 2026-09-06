import { Application } from "express";
import { calendarRoutes } from "./calendarRoutes.js";
import { collaborationRoutes } from "./collaborationRoutes.js";
import { financeRoutes } from "./financeRoutes.js";
import { invitationRoutes } from "./invitationRoutes.js";
import { learningRoutes } from "./learningRoutes.js";
import { notificationRoutes } from "./notificationRoutes.js";
import { portalRoutes } from "./portalRoutes.js";
import { taskRoutes } from "./taskRoutes.js";
import { timeRoutes } from "./timeRoutes.js";
import { workRoutes } from "./workRoutes.js";
import { realtimeRoutes } from "../realtime/realtimeRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { communityRoutes } from "./communityRoutes.js";
import { projectRoutes } from "./projectRoutes.js";
import { roleRoutes } from "./roleRoutes.js";
import { userRoutes } from "./userRoutes.js";

const router = (app: Application): void => {
    app.use("/auth", authRoutes);
    app.use("/communities", communityRoutes);
    app.use("/projects", projectRoutes);
    app.use("/roles", roleRoutes);
    app.use("/users", userRoutes);
    app.use("/realtime", realtimeRoutes);
    app.use("/notifications", notificationRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/collaboration", collaborationRoutes);
    app.use("/invitations", invitationRoutes);
    app.use("/learning", learningRoutes);
    app.use("/work", workRoutes);
    app.use("/time", timeRoutes);
    app.use("/finance", financeRoutes);
    app.use("/portal", portalRoutes);
    app.use("/calendar", calendarRoutes);
};

export { router };
