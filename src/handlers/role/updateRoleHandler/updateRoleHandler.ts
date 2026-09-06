import { NextFunction } from "express";
import { IRole } from "../../../database/models/role/IRole.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import {
    enqueueRealtimeEvent,
    pusherSocketId,
    realtimeDocument,
    realtimeVersion,
} from "../../../realtime/events.js";
import { authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { UpdateRoleRequest } from "./updateRoleRequest.js";
import { updateRoleSecurity } from "./updateRoleSecurity.js";

export const updateRoleHandler = async (
    req: IRequest<UpdateRoleRequest, "role">,
    res: IResponse,
    next: NextFunction,
) => {
    try {
        const requestModel = req.requestModel;
        const role = (await RoleQueries.getRoleByIdQuery(requestModel?.id as string)) as IRole;
        if (role && !authorizeResourceCommunity(res, req.community, role.communityId)) return;
        if (checkSecurity(updateRoleSecurity(res, role))) {
            const { id, ...updateModel } = requestModel as UpdateRoleRequest;
            const updatedRole = await runInTransaction(async () => {
                const updated = await RoleQueries.updateRoleQuery(id, updateModel);
                if (updated) {
                    await enqueueRealtimeEvent({
                        channels: [RealtimeChannels.community(role.communityId)],
                        eventName: "role-updated-v1",
                        actorId: req.userId,
                        aggregate: { type: "role", id, version: realtimeVersion(updated) },
                        data: { role: realtimeDocument(updated), changedFields: Object.keys(updateModel) },
                        socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                    });
                }
                return updated;
            });
            req.role = updatedRole;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateRoleHandler.name);
    }
};
