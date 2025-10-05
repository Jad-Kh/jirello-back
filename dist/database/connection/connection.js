"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = prepareDatabaseConnection;
const mongoose_1 = __importDefault(require("mongoose"));
function prepareDatabaseConnection() {
    mongoose_1.default.connect(process.env.MONGO_CONNECT_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error) => {
        if (error)
            return console.log("Database Connection Failed");
        console.log("Database Connection Successful");
    });
}
;
