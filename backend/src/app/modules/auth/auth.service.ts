/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const signUpUser = async (data: User): Promise<User | null> => {
  const password = await bcrypt.hash(
    data?.password,
    Number(config.bycrypt_salt_rounds)
  );
  data.password = password;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user already exist');
  }

  const result = await prisma.user.create({
    data,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }

  return result;
};

const loginUser = async (data: any): Promise<any> => {
  const { email, password } = data;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user does not exist');
  }

  const decriptedPassword = await bcrypt.compare(
    password,
    isUserExist.password
  );

  if (isUserExist?.password && !decriptedPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'password is incorrect');
  }
  const accessToken = jwtHelpers.createToken(
    {
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifyToken = null;
  try {
    verifyToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(404, 'invalid token');
  }
  // step 2 cheek if user exists or not

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: verifyToken?.email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not exist');
  }

  // const { email } = isUserExist

  // step 3 generate new token
  const accessToken = jwtHelpers.createToken(
    {
      id: isUserExist?.userId,
      email: isUserExist?.email,
      role: isUserExist?.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
  };
};

const authServices = {
  signUpUser,
  loginUser,
  refreshToken,
};
export default authServices;
