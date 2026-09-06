import { NextFunction } from "express";
import { IRole } from "../../../database/models/role/IRole.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { UserQueries } from "../../../database/queries/user.js";
import { runInTransaction } from "../../../database/transaction.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { authorizeCommunityMember, authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { AssignRoleToUserRequest } from "./assignRoleToUserRequest.js";
import { assignRoleToUserSecurity } from "./assignRoleToUserSecurity.js";

export const assignRoleToUserHandler = async (
    req: IRequest<AssignRoleToUserRequest, "role">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const role = (await RoleQueries.getRoleByIdQuery(requestModel!.roleId)) as IRole;
        const user = (await UserQueries.getUserByIdQuery(requestModel!.userId)) as IUser;
        if (role && !authorizeResourceCommunity(res, req.community, role.communityId)) return;
        if (user && !authorizeCommunityMember(res, req.community, user.id as string)) return;
        if (checkSecurity(assignRoleToUserSecurity(res, role, user, requestModel!.userId))) {
            await runInTransaction(async () => {
                await RoleQueries.addUserToRoleQuery(requestModel!.roleId, requestModel!.userId);
                await UserQueries.assignRoleToUserQuery(requestModel!.userId, requestModel!.roleId);
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(role.communityId),
                        RealtimeChannels.user(requestModel!.userId),
                    ],
                    eventName: "role-assigned-v1",
                    actorId: req.userId,
                    aggregate: { type: "role-assignment", id: requestModel!.roleId, version: Date.now() },
                    data: {
                        roleId: requestModel!.roleId,
                        userId: requestModel!.userId,
                        communityId: role.communityId,
                    },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
                await createNotification({
                    recipientId: requestModel!.userId,
                    actorId: req.userId,
                    communityId: role.communityId,
                    resourceType: "role",
                    resourceId: role.id,
                    type: "role-assigned",
                    title: "Role assigned",
                    body: `You were assigned the ${role.title} role.`,
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, assignRoleToUserHandler.name);
    }
};
