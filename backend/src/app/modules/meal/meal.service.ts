/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meal, MealDays, MealStatus } from '@prisma/client';
import { BAD_REQUEST } from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createMeal = async (typeData: any): Promise<Meal> => {
  // Check if a meal already exists for the specified day
  const existingMeal = await prisma.meal.findFirst({
    where: {
      mealDay: typeData.mealDay,
    },
  });

  if (existingMeal) {
    throw new ApiError(
      BAD_REQUEST,
      `A meal for ${typeData.mealDay} already exists.`
    );
  }

  if (typeData.items.length < 3) {
    throw new ApiError(
      BAD_REQUEST,
      'A meal must have at least 3 items to be complete.'
    );
  }

  const items = await prisma.item.findMany({
    where: {
      itemId: { in: typeData.items },
    },
  });

  const hasRice = items.some(item => item.category === 'Starch');
  const proteinItems = items.filter(item => item.category === 'Protein');

  if (!hasRice) {
    throw new ApiError(
      BAD_REQUEST,
      'A meal must have a rice item to be complete.'
    );
  }

  if (proteinItems.length > 1) {
    throw new ApiError(
      BAD_REQUEST,
      'A meal cannot have two protein sources at a time.'
    );
  }

  // Find existing meals with the same items
  const existingMeals = await prisma.meal.findMany({
    where: {
      items: {
        some: {
          itemId: { in: typeData.items },
        },
      },
    },
    include: {
      items: true,
    },
  });

  const repeatedDaysSet = new Set<MealDays>();
  existingMeals.forEach(meal => {
    if (
      meal.items.length === typeData.items.length &&
      meal.items.every(item => typeData.items.includes(item.itemId))
    ) {
      repeatedDaysSet.add(meal.mealDay);
    }
  });

  if (typeData.repeatedDays) {
    repeatedDaysSet.add(typeData.repeatedDays);
  }

  // Check if the same meal is repeated more than two days
  if (repeatedDaysSet.size > 1) {
    throw new ApiError(
      BAD_REQUEST,
      'The same meal can only be repeated a maximum of two days in a week.'
    );
  }

  // Set status to Complete if constraints are met
  const status = MealStatus.Completed;

  const createdMeal = await prisma.meal.create({
    data: {
      mealDay: typeData.mealDay,
      repeatedDays: typeData.repeatedDays || null,
      status,
      items: {
        create: typeData.items.map((itemId: string) => ({
          item: { connect: { itemId } },
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return createdMeal;
};

const getAllMeals = async () => {
  const result = await prisma.meal.findMany({
    include: {
      items: {
        select: {
          mealId: true,
          itemId: true,
          item: true,
        },
      },
    },
  });

  return result;
};

const getAMeal = async (id: string): Promise<Meal | null> => {
  const result = await prisma.meal.findUnique({
    where: {
      mealId: id,
    },
    include: {
      items: {
        select: {
          mealId: true,
          itemId: true,
          item: true,
        },
      },
    },
  });

  return result;
};

const updateMeal = async (id: string, payload: any): Promise<Meal> => {
  if (payload.items && payload.items.length < 3) {
    throw new ApiError(
      BAD_REQUEST,
      'A meal must have at least 3 items to be complete.'
    );
  }

  if (payload.items) {
    const items = await prisma.item.findMany({
      where: {
        itemId: { in: payload.items },
      },
    });

    const hasRice = items.some(item => item.category === 'Starch');
    const proteinItems = items.filter(item => item.category === 'Protein');

    if (!hasRice) {
      throw new ApiError(
        BAD_REQUEST,
        'A meal must have a rice item to be complete.'
      );
    }

    if (proteinItems.length > 1) {
      throw new ApiError(
        BAD_REQUEST,
        'A meal cannot have two protein sources at a time.'
      );
    }
  }

  const existingMeal = await prisma.meal.findUnique({
    where: {
      mealId: id,
    },
  });

  if (!existingMeal) {
    throw new ApiError(BAD_REQUEST, `Meal with id ${id} does not exist.`);
  }

  const result = await prisma.meal.update({
    where: {
      mealId: id,
    },
    data: {
      ...payload,
      items: {
        connect:
          payload.items?.map((itemId: string) => ({
            itemId,
          })) || [],
      },
    },
    include: {
      items: true,
    },
  });

  return result;
};

const deleteMeal = async (id: string): Promise<Meal> => {
  //  Delete related MealItems
  await prisma.mealItem.deleteMany({
    where: {
      mealId: id,
    },
  });

  // Delete the meal itself
  const result = await prisma.meal.delete({
    where: {
      mealId: id,
    },
    include: {
      items: true,
    },
  });

  return result;
};

export const MealService = {
  createMeal,
  getAllMeals,
  getAMeal,
  updateMeal,
  deleteMeal,
};
