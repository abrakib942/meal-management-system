"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const meal_controller_1 = require("./meal.controller");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), 
//   validateRequest(MealValidation.createMealZodSchema),
meal_controller_1.MealController.createMeal);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), meal_controller_1.MealController.getAllMeals);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), meal_controller_1.MealController.getAMeal);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), meal_controller_1.MealController.updateMeal);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), meal_controller_1.MealController.deleteMeal);
exports.MealRoutes = router;
