import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import authController from './auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.signUpUserZodSchema),
  authController.signUpUser
);
router.post(
  '/signin',
  validateRequest(UserValidation.loginUserZodSchema),
  authController.loginUser
);
router.post('/refresh-token', authController.refreshToken);

export const AuthRoute = router;
