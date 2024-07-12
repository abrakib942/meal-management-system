import express from 'express';
import { AuthRoute } from '../modules/auth/auth.routes';
import { ItemRoutes } from '../modules/item/item.routes';
import { MealRoutes } from '../modules/meal/meal.routes';
import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/',
    route: UserRoutes,
  },
  {
    path: '/items',
    route: ItemRoutes,
  },
  {
    path: '/meals',
    route: MealRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
