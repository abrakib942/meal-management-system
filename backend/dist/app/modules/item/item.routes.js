"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const item_controller_1 = require("./item.controller");
const item_validation_1 = require("./item.validation");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(item_validation_1.ItemValidation.createItemZodSchema), item_controller_1.ItemController.createItem);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), item_controller_1.ItemController.getAllItems);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), item_controller_1.ItemController.getAItem);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(item_validation_1.ItemValidation.updateItemZodSchema), item_controller_1.ItemController.updateItem);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), item_controller_1.ItemController.deleteItem);
exports.ItemRoutes = router;
