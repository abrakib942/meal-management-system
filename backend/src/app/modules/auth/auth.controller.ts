import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import authServices from './auth.service';

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signUpUser(req.body);

  res.send({
    success: true,
    statusCode: 200,
    message: 'User Signed up successfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, ...others } = result;
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.send({
    success: true,
    statusCode: 200,
    message: 'user login successfully',
    data: others,
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  const cookieOptions = {
    secure: config.env === 'production' ? true : false,
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.send({
    statusCode: 200,
    success: true,
    message: 'User login Successfully',
    data: result,
  });
});

const authController = {
  signUpUser,
  loginUser,
  refreshToken,
};
export default authController;
