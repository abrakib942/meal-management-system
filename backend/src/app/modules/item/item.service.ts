/* eslint-disable @typescript-eslint/no-explicit-any */

import { Item, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const createItem = (typeData: Item): Promise<Item> => {
  const result = prisma.item.create({
    data: typeData,
    include: {
      meals: true,
    },
  });

  return result;
};

const getAllItems = async (filters: any, options: IPaginationOptions) => {
  const searchableFields = ['name'];

  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, category } = filters;

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

  const whereConditions: Prisma.ItemWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  if (category) {
    whereConditions.category = category;
  }

  const result = await prisma.item.findMany({
    include: {
      meals: {
        select: {
          itemId: true,
          meal: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.item.count({
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

const getAItem = async (id: string): Promise<Item | null> => {
  const result = await prisma.item.findUnique({
    where: {
      itemId: id,
    },
    include: {
      meals: {
        select: {
          itemId: true,
          meal: true,
        },
      },
    },
  });
  return result;
};

const updateItem = async (
  id: string,
  payload: Partial<Item>
): Promise<Item> => {
  const result = await prisma.item.update({
    where: {
      itemId: id,
    },
    data: payload,
    include: {
      meals: true,
    },
  });
  return result;
};

const deleteItem = async (id: string): Promise<Item> => {
  const result = await prisma.item.delete({
    where: {
      itemId: id,
    },
    include: {
      meals: true,
    },
  });
  return result;
};

export const ItemService = {
  createItem,
  getAllItems,
  getAItem,
  updateItem,
  deleteItem,
};
