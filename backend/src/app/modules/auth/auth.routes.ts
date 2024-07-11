import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import authController from './auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.signUpUserZodSchema),
  authController.signUpUser
);
router.post(
  '/login',
  validateRequest(UserValidation.loginUserZodSchema),
  authController.loginUser
);
router.post('/refresh-token', authController.refreshToken);

export const AuthRoute = router;
