export type DateCursor = {
    createdAt: string;
    id: string;
};

export type PositionCursor = {
    position: number;
    id: string;
};

export function encodeDateCursor(createdAt: Date, id: string): string {
    return Buffer.from(JSON.stringify({ createdAt: createdAt.toISOString(), id })).toString("base64url");
}

export function decodeDateCursor(value: string): DateCursor | null {
    try {
        const cursor = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<DateCursor>;
        if (
            typeof cursor.createdAt !== "string" ||
            Number.isNaN(new Date(cursor.createdAt).getTime()) ||
            typeof cursor.id !== "string" ||
            !/^[a-f\d]{24}$/i.test(cursor.id)
        ) {
            return null;
        }
        return { createdAt: cursor.createdAt, id: cursor.id };
    } catch {
        return null;
    }
}

export function encodePositionCursor(position: number, id: string): string {
    return Buffer.from(JSON.stringify({ position, id })).toString("base64url");
}

export function decodePositionCursor(value: string): PositionCursor | null {
    try {
        const cursor = JSON.parse(
            Buffer.from(value, "base64url").toString("utf8"),
        ) as Partial<PositionCursor>;
        if (
            typeof cursor.position !== "number" ||
            !Number.isFinite(cursor.position) ||
            typeof cursor.id !== "string" ||
            !/^[a-f\d]{24}$/i.test(cursor.id)
        ) {
            return null;
        }

        return { position: cursor.position, id: cursor.id };
    } catch {
        return null;
    }
}
