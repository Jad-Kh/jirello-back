import { NextFunction } from "express";
import { IRole } from "../../../database/models/role/IRole.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RoleResponse } from "../../../models/role/RoleResponse.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import {
    enqueueRealtimeEvent,
    pusherSocketId,
    realtimeDocument,
    realtimeVersion,
} from "../../../realtime/events.js";
import { createRoleMapper } from "./createRoleMapper.js";
import { RoleRequest } from "./createRoleRequest.js";
import { createRoleSecurity } from "./createRoleSecurity.js";

export const createRoleHandler = async (
    req: IRequest<RoleRequest, "role">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const roleByTitle = (await RoleQueries.getRoleByTitleQuery(
            requestModel?.title as string,
            requestModel?.communityId,
        )) as IRole;
        if (checkSecurity(createRoleSecurity(res, roleByTitle, requestModel?.communityId as string))) {
            const mappedRole = createRoleMapper(requestModel as RoleRequest, req.userId as string);
            const newRole = new RoleResponse(mappedRole);
            const savedRole = await runInTransaction(async () => {
                const saved = await RoleQueries.createRoleQuery(newRole as IRole);
                await CommunityQueries.addRoleToCommunityQuery(requestModel!.communityId, saved.id);
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.community(requestModel!.communityId)],
                    eventName: "role-created-v1",
                    actorId: req.userId,
                    aggregate: { type: "role", id: saved.id, version: realtimeVersion(saved) },
                    data: { role: realtimeDocument(saved) },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
                return saved;
            });
            req.role = savedRole;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, createRoleHandler.name);
    }
};
