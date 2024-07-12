import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MealService } from './meal.service';

const createMeal = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.createMeal(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal created successfully',
    data: result,
  });
});
const getAllMeals = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getAllMeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meals retrieved successfully',
    data: result,
  });
});
const getAMeal = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getAMeal(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal retrieved successfully',
    data: result,
  });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MealService.updateMeal(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal updated successfully',
    data: result,
  });
});

const deleteMeal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MealService.deleteMeal(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal deleted successfully',
    data: result,
  });
});

export const MealController = {
  createMeal,
  getAllMeals,
  getAMeal,
  updateMeal,
  deleteMeal,
};
