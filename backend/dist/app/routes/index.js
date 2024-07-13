"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const item_routes_1 = require("../modules/item/item.routes");
const meal_routes_1 = require("../modules/meal/meal.routes");
const user_routes_1 = require("../modules/user/user.routes");
const order_routes_1 = require("../modules/mealOrder/order.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_routes_1.AuthRoute,
    },
    {
        path: '/',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/items',
        route: item_routes_1.ItemRoutes,
    },
    {
        path: '/meals',
        route: meal_routes_1.MealRoutes,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
