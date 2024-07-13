"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.OrderService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const makeOrder = (typeData) => {
    const result = prisma_1.default.mealOrder.create({
        data: typeData,
        include: {
            meal: true,
            user: true,
        },
    });
    return result;
};
const getAllOrders = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['name'];
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
    const whereConditions = andConditons.length > 0 ? { AND: andConditons } : {};
    const result = yield prisma_1.default.mealOrder.findMany({
        include: {
            meal: true,
            user: true,
        },
        where: whereConditions,
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.mealOrder.count({
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
const getAOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.mealOrder.findUnique({
        where: {
            orderId: id,
        },
        include: {
            meal: true,
            user: true,
        },
    });
    return result;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.mealOrder.update({
        where: {
            orderId: id,
        },
        data: payload,
    });
    return result;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.mealOrder.delete({
        where: {
            orderId: id,
        },
    });
    return result;
});
exports.OrderService = {
    makeOrder,
    getAOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
};
