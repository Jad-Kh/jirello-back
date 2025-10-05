declare global {
    namespace Express {
        interface Request {
            user?: any;
            community?: any;
            role?: any;
            entity?: any;
            project?: any;
            requestModel?: any;
        }
    }
}

export {};