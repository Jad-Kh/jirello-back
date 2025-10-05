"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectValidator = exports.createProjectValidator = void 0;
const validator_ts_1 = require("../helpers/validator.ts");
const ProjectErrorResponses_ts_1 = require("../responses/errors/ProjectErrorResponses.ts");
const projectValidationSchemes_ts_1 = require("./schemes/projectValidationSchemes.ts");
exports.createProjectValidator = (0, validator_ts_1.createValidator)(projectValidationSchemes_ts_1.ProjectValidationSchemes.createProjectValidationScheme, ProjectErrorResponses_ts_1.ProjectErrorResponses.CREATION_ERROR);
exports.updateProjectValidator = (0, validator_ts_1.createValidator)(projectValidationSchemes_ts_1.ProjectValidationSchemes.updateProjectValidationScheme, ProjectErrorResponses_ts_1.ProjectErrorResponses.PROJECT_UPDATE_ERROR, true);
