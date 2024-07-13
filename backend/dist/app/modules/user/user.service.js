"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllUsers = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['name', 'email'];
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
    const whereConditions = andConditons.length > 0 ? { AND: andConditons } : {};
    if (role) {
        whereConditions.role = role;
    }
    if (status) {
        whereConditions.status = status;
    }
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.user.count({
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
});
const getAUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            userId: id,
        },
    });
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            userId: id,
        },
        data: payload,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            userId: id,
        },
    });
    return result;
});
const getUserProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = token;
    const result = yield prisma_1.default.user.findUnique({
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
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    return result;
});
exports.UserService = {
    getAllUsers,
    getAUser,
    updateUser,
    deleteUser,
    getUserProfile,
};
