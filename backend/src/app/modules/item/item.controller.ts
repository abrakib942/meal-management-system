import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ItemService } from './item.service';

const createItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemService.createItem(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item created successfully',
    data: result,
  });
});
const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'category']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ItemService.getAllItems(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Items retrieved successfully',
    data: result,
  });
});
const getAItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemService.getAItem(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item retrieved successfully',
    data: result,
  });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ItemService.updateItem(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item updated successfully',
    data: result,
  });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ItemService.deleteItem(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item deleted successfully',
    data: result,
  });
});

export const ItemController = {
  createItem,
  getAllItems,
  getAItem,
  updateItem,
  deleteItem,
};
