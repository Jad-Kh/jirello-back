"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = prepareAppStartUp;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = require("../routes/index.js");
const connection_js_1 = __importDefault(require("../database/connection/connection.js"));
dotenv_1.default.config();
const port = 8082;
function prepareAppStartUp() {
    (0, connection_js_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: "*", methods: "GET, POST, PUT, PATCH, DELETE" }));
    app.use(express_1.default.json({ limit: "20GB" }));
    app.use((0, cookie_parser_1.default)());
    (0, index_js_1.router)(app);
    const Server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    Server.timeout = 36000000;
}
;
