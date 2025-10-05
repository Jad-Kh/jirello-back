"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authValidators_js_1 = require("../validators/authValidators.js");
const signUpHandler_js_1 = require("../handlers/auth/signUpHandler/signUpHandler.js");
const authSecurity_js_1 = require("../security/authSecurity.js");
const authPresenter_js_1 = require("../presenters/authPresenter.js");
const endpointForward_js_1 = require("../helpers/endpointForward.js");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const signUpChain = [
    authValidators_js_1.signUpValidator,
    signUpHandler_js_1.signUpHandler,
    authSecurity_js_1.authSecurity,
    authPresenter_js_1.signUpPresenter,
    endpointForward_js_1.endpointForward
];
authRoutes.post("/sign-up", ...signUpChain);
