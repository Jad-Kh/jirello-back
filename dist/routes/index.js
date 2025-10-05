"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const authRoutes_js_1 = require("./authRoutes.js");
const router = (app) => {
    app.use("/auth", authRoutes_js_1.authRoutes);
};
exports.router = router;
