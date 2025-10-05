"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsernameOrEmail = void 0;
const parseUsernameOrEmail = (data) => {
    const { usernameOrEmail, password } = data;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = emailRegex.test(usernameOrEmail);
    return {
        username: isEmail ? undefined : usernameOrEmail,
        email: isEmail ? usernameOrEmail : undefined,
        password
    };
};
exports.parseUsernameOrEmail = parseUsernameOrEmail;
