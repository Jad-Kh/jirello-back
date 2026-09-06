import type { ICommunity } from "../../database/models/community/ICommunity.js";
import type { IProject } from "../../database/models/project/IProject.js";
import type { IRole } from "../../database/models/role/IRole.js";
import type { IUser } from "../../database/models/user/IUser.js";
import type { AuthResponse } from "../../models/auth/AuthResponse.js";
import type { RefreshTokenResponse } from "../../models/auth/RefreshTokenResponse.js";
import type { SuccessResponse } from "../../models/api/SuccessResponse.js";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthResponse;
            communities?: ICommunity[];
            community?: ICommunity | null;
            entity?: unknown;
            presenterModel?: unknown;
            project?: IProject | null;
            projects?: IProject[];
            responseModel?: unknown;
            role?: IRole | null;
            roles?: IRole[];
            statusCode?: number;
            successResponse?: Pick<SuccessResponse<unknown>, "code" | "message">;
            token?: RefreshTokenResponse;
            user?: IUser | null;
            userId?: string;
            users?: unknown;
        }
    }
}

export {};
