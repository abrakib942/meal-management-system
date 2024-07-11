import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/users', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

router.get(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  UserController.getAUser
);

router.patch(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);
router.delete(
  '/users/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.deleteUser
);

// router.get(
//   '/user-profile',
//   auth( ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
//   UserController.getUserProfile
// );

export const UserRoutes = router;
