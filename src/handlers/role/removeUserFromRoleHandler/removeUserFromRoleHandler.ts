import { NextFunction } from "express";
import { IRole } from "../../../database/models/role/IRole.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { UserQueries } from "../../../database/queries/user.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { authorizeCommunityMember, authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { RemoveUserFromRoleRequest } from "./removeUserFromRoleRequest.js";
import { removeUserFromRoleSecurity } from "./removeUserFromRoleSecurity.js";

export const removeUserFromRoleHandler = async (
    req: IRequest<RemoveUserFromRoleRequest, "role">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const role = (await RoleQueries.getRoleByIdQuery(requestModel!.roleId)) as IRole;
        const user = (await UserQueries.getUserByIdQuery(requestModel!.userId)) as IUser;
        if (role && !authorizeResourceCommunity(res, req.community, role.communityId)) return;
        if (user && !authorizeCommunityMember(res, req.community, user.id as string)) return;
        if (checkSecurity(removeUserFromRoleSecurity(res, role, user, requestModel!.userId))) {
            await runInTransaction(async () => {
                await RoleQueries.removeUserFromRoleQuery(requestModel!.roleId, requestModel!.userId);
                await UserQueries.removeRoleFromUserQuery(requestModel!.userId, requestModel!.roleId);
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(role.communityId),
                        RealtimeChannels.user(requestModel!.userId),
                    ],
                    eventName: "role-removed-v1",
                    actorId: req.userId,
                    aggregate: { type: "role-assignment", id: requestModel!.roleId, version: Date.now() },
                    data: {
                        roleId: requestModel!.roleId,
                        userId: requestModel!.userId,
                        communityId: role.communityId,
                    },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeUserFromRoleHandler.name);
    }
};
