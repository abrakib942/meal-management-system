/* eslint-disable @typescript-eslint/no-explicit-any */

import { MealOrder, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const makeOrder = (typeData: MealOrder): Promise<MealOrder> => {
  const result = prisma.mealOrder.create({
    data: typeData,
    include: {
      meal: true,
      user: true,
    },
  });

  return result;
};

const getAllOrders = async (filters: any, options: IPaginationOptions) => {
  const searchableFields = ['name'];

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

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

  const whereConditions: Prisma.MealOrderWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.mealOrder.findMany({
    include: {
      meal: true,
      user: true,
    },
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.mealOrder.count({
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

const getAOrder = async (id: string): Promise<MealOrder | null> => {
  const result = await prisma.mealOrder.findUnique({
    where: {
      orderId: id,
    },
    include: {
      meal: true,
      user: true,
    },
  });
  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<MealOrder>
): Promise<MealOrder> => {
  const result = await prisma.mealOrder.update({
    where: {
      orderId: id,
    },
    data: payload,
  });
  return result;
};

const deleteOrder = async (id: string): Promise<MealOrder> => {
  const result = await prisma.mealOrder.delete({
    where: {
      orderId: id,
    },
  });
  return result;
};

export const OrderService = {
  makeOrder,
  getAOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
