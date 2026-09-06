const objectIdPattern = /^[a-f\d]{24}$/i;

function assertId(id: string): string {
    if (!objectIdPattern.test(id)) throw new Error("Invalid realtime resource ID.");
    return id.toLowerCase();
}

export const RealtimeChannels = {
    user: (userId: string) => `private-user-${assertId(userId)}`,
    community: (communityId: string) => `private-community-${assertId(communityId)}`,
    project: (projectId: string) => `private-project-${assertId(projectId)}`,
    projectPresence: (projectId: string) => `presence-project-${assertId(projectId)}`,
};

export type ParsedChannel =
    | { kind: "user"; id: string; presence: false }
    | { kind: "community"; id: string; presence: false }
    | { kind: "project"; id: string; presence: boolean };

export function parseChannelName(channel: string): ParsedChannel | undefined {
    const match = /^(private-user|private-community|private-project|presence-project)-([a-f\d]{24})$/i.exec(
        channel,
    );
    if (!match) return undefined;
    const id = match[2]!.toLowerCase();
    if (match[1] === "private-user") return { kind: "user", id, presence: false };
    if (match[1] === "private-community") return { kind: "community", id, presence: false };
    return { kind: "project", id, presence: match[1] === "presence-project" };
}
