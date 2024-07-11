/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const getAllUsers = async (filters: any, options: IPaginationOptions) => {
  const searchableFields = ['name', 'email'];

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, role, status } = filters;
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  if (role) {
    whereConditions.role = role;
  }

  if (status) {
    whereConditions.status = status;
  }

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
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
