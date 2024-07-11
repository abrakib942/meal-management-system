/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllUsers = async () => {
  const result = await prisma.user.findMany({});

  return result;
};

const getAUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      userId: id,
    },
    data: payload,
  });
  return result;
};
const deleteUser = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      userId: id,
    },
  });
  return result;
};

const getUserProfile = async (token: any) => {
  const { role, userId } = token;
  const result = await prisma.user.findUnique({
    where: {
      userId: userId,
      role,
    },

    select: {
      userId: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  return result;
};

export const UserService = {
  getAllUsers,
  getAUser,
  updateUser,
  deleteUser,
  getUserProfile,
};
