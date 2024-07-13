import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MealController } from './meal.controller';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN),
  //   validateRequest(MealValidation.createMealZodSchema),
  MealController.createMeal
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MealController.getAllMeals
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MealController.getAMeal
);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), MealController.updateMeal);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), MealController.deleteMeal);

export const MealRoutes = router;
