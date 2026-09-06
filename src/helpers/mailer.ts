import nodemailer from "nodemailer";
import { getEnvironment } from "../startup/environment.js";
import { logger } from "./logger.js";

export type TransactionalEmailOptions = { messageId?: string };

export async function sendTransactionalEmail(
    to: string,
    subject: string,
    text: string,
    options: TransactionalEmailOptions = {},
): Promise<boolean> {
    const environment = getEnvironment();
    if (!environment.smtp) {
        logger.warn({ subject }, "Transactional email requested, but SMTP is not configured");
        return false;
    }
    const transport = nodemailer.createTransport({
        host: environment.smtp.host,
        port: environment.smtp.port,
        secure: environment.smtp.secure,
        auth: environment.smtp.user
            ? { user: environment.smtp.user, pass: environment.smtp.password }
            : undefined,
    });
    await transport.sendMail({
        from: environment.smtp.from,
        to,
        subject,
        text,
        messageId: options.messageId,
    });
    return true;
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const environment = getEnvironment();
    if (!environment.smtp) {
        logger.warn("Password recovery requested, but SMTP is not configured");
        return false;
    }

    const resetUrl = new URL(environment.passwordResetUrl);
    resetUrl.searchParams.set("token", token);
    return sendTransactionalEmail(
        email,
        "Reset your Jirello password",
        `A password reset was requested for your account. Open this link within ${environment.passwordResetTtlMinutes} minutes: ${resetUrl.toString()}\n\nIf you did not request this, ignore this email.`,
    );
}
