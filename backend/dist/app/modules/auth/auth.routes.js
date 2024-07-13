"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.UserValidation.signUpUserZodSchema), auth_controller_1.default.signUpUser);
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidation.loginUserZodSchema), auth_controller_1.default.loginUser);
router.post('/refresh-token', auth_controller_1.default.refreshToken);
exports.AuthRoute = router;
