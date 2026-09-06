import { MemberCapacityQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetMemberCapacityRequest } from "./getMemberCapacityRequest.js";

import { Permissions } from "../../../helpers/permissions.js";
import { communityAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function getMemberCapacityHandler(
    request: IRequest<GetMemberCapacityRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (
            !(await communityAccess(request.userId!, value.communityId, "users", [
                Permissions.READ_OWN,
                Permissions.READ_OTHER,
            ]))
        ) {
            response.status(403).json({ ...TimeErrorResponses.CAPACITY_ACCESS_DENIED });
            return;
        }
        const baseFilter = { communityId: value.communityId };
        const [candidates, total] = await Promise.all([
            MemberCapacityQueries.getMemberCapacitiesQuery({
                ...baseFilter,
                ...(value.cursor ? { userId: { $gt: value.cursor } } : {}),
            })
                .sort({ userId: 1 })
                .limit(value.limit + 1),
            MemberCapacityQueries.countMemberCapacitiesQuery(baseFilter),
        ]);
        const hasMore = candidates.length > value.limit;
        const capacity = candidates.slice(0, value.limit);
        request.responseModel = {
            capacity,
            total,
            nextCursor: hasMore ? (capacity.at(-1)?.userId ?? null) : null,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
