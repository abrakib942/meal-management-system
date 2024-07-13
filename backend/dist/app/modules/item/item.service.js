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
exports.ItemService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createItem = (typeData) => {
    const result = prisma_1.default.item.create({
        data: typeData,
        include: {
            meals: true,
        },
    });
    return result;
};
const getAllItems = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['name'];
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
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
    const whereConditions = andConditons.length > 0 ? { AND: andConditons } : {};
    if (category) {
        whereConditions.category = category;
    }
    const result = yield prisma_1.default.item.findMany({
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
    const total = yield prisma_1.default.item.count({
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
const getAItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.item.findUnique({
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
});
const updateItem = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.item.update({
        where: {
            itemId: id,
        },
        data: payload,
        include: {
            meals: true,
        },
    });
    return result;
});
const deleteItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.item.delete({
        where: {
            itemId: id,
        },
        include: {
            meals: true,
        },
    });
    return result;
});
exports.ItemService = {
    createItem,
    getAllItems,
    getAItem,
    updateItem,
    deleteItem,
};
