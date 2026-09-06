export type ScaleProfile = {
    communities: number;
    usersPerCommunity: number;
    projectsPerCommunity: number;
    tasksPerProject: number;
    messagesPerProject: number;
    notificationsPerUser: number;
    timeEntriesPerUser: number;
    eventsPerProject: number;
    deliverablesPerProject: number;
    commentsPerProject: number;
};

export const scaleProfiles = {
    tiny: {
        communities: 1,
        usersPerCommunity: 12,
        projectsPerCommunity: 3,
        tasksPerProject: 20,
        messagesPerProject: 40,
        notificationsPerUser: 10,
        timeEntriesPerUser: 10,
        eventsPerProject: 10,
        deliverablesPerProject: 3,
        commentsPerProject: 8,
    },
    small: {
        communities: 3,
        usersPerCommunity: 100,
        projectsPerCommunity: 10,
        tasksPerProject: 50,
        messagesPerProject: 200,
        notificationsPerUser: 20,
        timeEntriesPerUser: 20,
        eventsPerProject: 20,
        deliverablesPerProject: 5,
        commentsPerProject: 20,
    },
    medium: {
        communities: 10,
        usersPerCommunity: 500,
        projectsPerCommunity: 50,
        tasksPerProject: 100,
        messagesPerProject: 500,
        notificationsPerUser: 100,
        timeEntriesPerUser: 50,
        eventsPerProject: 20,
        deliverablesPerProject: 8,
        commentsPerProject: 30,
    },
    large: {
        communities: 20,
        usersPerCommunity: 500,
        projectsPerCommunity: 50,
        tasksPerProject: 250,
        messagesPerProject: 1_000,
        notificationsPerUser: 150,
        timeEntriesPerUser: 50,
        eventsPerProject: 50,
        deliverablesPerProject: 10,
        commentsPerProject: 50,
    },
} satisfies Record<string, ScaleProfile>;

export type ScaleProfileName = keyof typeof scaleProfiles;

export type ScaleSeedOptions = {
    profileName: ScaleProfileName;
    profile: ScaleProfile;
    seed: string;
    runId: string;
    anchor: Date;
    batchSize: number;
    reset: boolean;
};

function valueAfter(argument: string, name: string): string | undefined {
    const prefix = `--${name}=`;
    if (argument.startsWith(prefix)) return argument.slice(prefix.length);
    return undefined;
}

export function parseScaleSeedOptions(arguments_: string[]): ScaleSeedOptions {
    const values = new Map<string, string>();
    for (const argument of arguments_) {
        for (const name of ["profile", "seed", "anchor", "batch-size"]) {
            const value = valueAfter(argument, name);
            if (value !== undefined) values.set(name, value);
        }
    }

    const requestedProfile = values.get("profile") ?? process.env.SEED_PROFILE ?? "small";
    if (!(requestedProfile in scaleProfiles)) {
        throw new Error(`Unknown seed profile "${requestedProfile}".`);
    }
    const profileName = requestedProfile as ScaleProfileName;
    const seed = values.get("seed") ?? process.env.SEED_RANDOM_STATE ?? "20260903";
    const anchorValue =
        values.get("anchor") ?? process.env.SEED_ANCHOR ?? new Date().toISOString().slice(0, 10);
    const anchor = new Date(`${anchorValue}T12:00:00.000Z`);
    if (Number.isNaN(anchor.getTime())) throw new Error("SEED_ANCHOR must use YYYY-MM-DD.");

    const batchSize = Number(values.get("batch-size") ?? process.env.SEED_BATCH_SIZE ?? 2_000);
    if (!Number.isInteger(batchSize) || batchSize < 100 || batchSize > 10_000) {
        throw new Error("Seed batch size must be an integer between 100 and 10000.");
    }

    const namespace = seed
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .slice(0, 24);
    return {
        profileName,
        profile: scaleProfiles[profileName],
        seed,
        runId: `scale-${profileName}-${namespace}`,
        anchor,
        batchSize,
        reset: arguments_.includes("--reset"),
    };
}

export function profileTotals(profile: ScaleProfile) {
    const users = profile.communities * profile.usersPerCommunity;
    const projects = profile.communities * profile.projectsPerCommunity;
    return {
        communities: profile.communities,
        users,
        projects,
        tasks: projects * profile.tasksPerProject,
        messages: projects * profile.messagesPerProject,
        notifications: users * profile.notificationsPerUser,
        timeEntries: users * profile.timeEntriesPerUser,
        calendarEvents: projects * profile.eventsPerProject,
        deliverables: projects * profile.deliverablesPerProject,
        portalComments: projects * profile.commentsPerProject,
    };
}
