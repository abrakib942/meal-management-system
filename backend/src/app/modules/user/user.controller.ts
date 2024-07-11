import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'role', 'status']);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserProfile(req.user);

  res.send({
    statusCode: 200,
    success: true,
    message: 'User profile information retrieved Successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getAUser,
  updateUser,
  deleteUser,
  getUserProfile,
};
