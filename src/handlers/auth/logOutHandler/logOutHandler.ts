import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { clearRefreshTokenCookie } from "../../../helpers/authCookies.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { logger } from "../../../helpers/logger.js";
import { getPusherClient } from "../../../realtime/pusherClient.js";

export const logOutHandler = async (
    req: IRequest<Record<string, never>, never>,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        if (req.userId) {
            await UserQueries.removeUserAccessQuery(req.userId);
            try {
                await getPusherClient()?.terminateUserConnections(req.userId);
            } catch (error) {
                logger.warn(
                    { err: error, userId: req.userId },
                    "Could not terminate Pusher connections during logout",
                );
            }
        }
        clearRefreshTokenCookie(res);
        next();
    } catch (error) {
        catchError(error as Error, res, logOutHandler.name);
    }
};
