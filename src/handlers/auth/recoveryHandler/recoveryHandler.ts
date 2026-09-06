import { randomBytes } from "node:crypto";
import { performance } from "node:perf_hooks";
import bcrypt from "bcrypt";
import { UserQueries } from "../../../database/queries/user.js";
import { enqueuePasswordResetEmail } from "../../../queues/emailQueue.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { logger } from "../../../helpers/logger.js";
import { getPusherClient } from "../../../realtime/pusherClient.js";
import { getEnvironment } from "../../../startup/environment.js";
import { RecoveryRequest, ResetPasswordRequest } from "./recoveryRequest.js";

export const recoveryHandler = async (
    request: IRequest<RecoveryRequest, never>,
    response: IResponse,
): Promise<void> => {
    const endpointStartedAt = performance.now();
    let databaseMs = 0;
    let queueMs = 0;
    let accountFound = false;
    try {
        const environment = getEnvironment();
        const lookupStartedAt = performance.now();
        const user = await UserQueries.getUserByEmailQuery(request.requestModel!.email);
        databaseMs += performance.now() - lookupStartedAt;
        accountFound = Boolean(user);
        if (user && environment.smtp) {
            const token = randomBytes(32).toString("base64url");
            const expiresAt = new Date(Date.now() + environment.passwordResetTtlMinutes * 60_000);
            const writeStartedAt = performance.now();
            await UserQueries.setPasswordResetTokenQuery(user.id, JWTkit.hashToken(token), expiresAt);
            databaseMs += performance.now() - writeStartedAt;
            const queueStartedAt = performance.now();
            const jobId = await enqueuePasswordResetEmail({ email: user.profile.email, token });
            queueMs = performance.now() - queueStartedAt;
            if (!jobId) logger.warn({ userId: user.id }, "Password recovery email queue is disabled");
        }
    } catch (error) {
        logger.error({ err: error }, "Password recovery delivery failed");
    }

    logger.info(
        {
            requestId: request.id,
            endpoint: "POST /auth/recovery",
            accountFound,
            timing: {
                databaseMs: Number(databaseMs.toFixed(2)),
                queueMs: Number(queueMs.toFixed(2)),
                totalMs: Number((performance.now() - endpointStartedAt).toFixed(2)),
            },
        },
        "Password recovery request timing",
    );

    response.status(202).json({
        code: 202,
        message: "If the account exists, password reset instructions will be sent.",
    });
};

export const resetPasswordHandler = async (
    request: IRequest<ResetPasswordRequest, never>,
    response: IResponse,
): Promise<void> => {
    const tokenHash = JWTkit.hashToken(request.requestModel!.token);
    const passwordHash = await bcrypt.hash(request.requestModel!.password, 12);
    const updated = await UserQueries.resetPasswordQuery(tokenHash, passwordHash, new Date());
    if (!updated) {
        response.status(400).json({ code: 400, message: "Password reset token is invalid or expired." });
        return;
    }
    try {
        await getPusherClient()?.terminateUserConnections(updated.id);
    } catch (error) {
        logger.warn(
            { err: error, userId: updated.id },
            "Could not terminate Pusher connections after password reset",
        );
    }
    response.status(200).json({ code: 200, message: "Password has been reset." });
};
