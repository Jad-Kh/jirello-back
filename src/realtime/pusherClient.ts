import Pusher from "pusher";
import { getEnvironment } from "../startup/environment.js";

let client: Pusher | undefined;

export function getPusherClient(): Pusher | undefined {
    const configuration = getEnvironment().pusher;
    if (!configuration) return undefined;
    client ??= new Pusher({
        appId: configuration.appId,
        key: configuration.key,
        secret: configuration.secret,
        cluster: configuration.cluster,
        useTLS: configuration.useTls,
        timeout: 10_000,
    });
    return client;
}

export function resetPusherClient(): void {
    client = undefined;
}
