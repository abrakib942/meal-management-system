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
exports.MealService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const http_status_1 = require("http-status");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createMeal = (typeData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a meal already exists for the specified day
    const existingMeal = yield prisma_1.default.meal.findFirst({
        where: {
            mealDay: typeData.mealDay,
        },
    });
    if (existingMeal) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, `A meal for ${typeData.mealDay} already exists.`);
    }
    if (typeData.items.length < 3) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal must have at least 3 items to be complete.');
    }
    const items = yield prisma_1.default.item.findMany({
        where: {
            itemId: { in: typeData.items },
        },
    });
    const hasRice = items.some(item => item.category === 'Starch');
    const proteinItems = items.filter(item => item.category === 'Protein');
    if (!hasRice) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal must have a rice item to be complete.');
    }
    if (proteinItems.length > 1) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal cannot have two protein sources at a time.');
    }
    // Find existing meals with the same items
    const existingMeals = yield prisma_1.default.meal.findMany({
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
    const repeatedDaysSet = new Set();
    existingMeals.forEach(meal => {
        if (meal.items.length === typeData.items.length &&
            meal.items.every(item => typeData.items.includes(item.itemId))) {
            repeatedDaysSet.add(meal.mealDay);
        }
    });
    if (typeData.repeatedDays) {
        repeatedDaysSet.add(typeData.repeatedDays);
    }
    // Check if the same meal is repeated more than two days
    if (repeatedDaysSet.size > 1) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'The same meal can only be repeated a maximum of two days in a week.');
    }
    // Set status to Complete if constraints are met
    const status = client_1.MealStatus.Completed;
    const createdMeal = yield prisma_1.default.meal.create({
        data: {
            mealDay: typeData.mealDay,
            repeatedDays: typeData.repeatedDays || null,
            status,
            items: {
                create: typeData.items.map((itemId) => ({
                    item: { connect: { itemId } },
                })),
            },
        },
        include: {
            items: true,
        },
    });
    return createdMeal;
});
const getAllMeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.meal.findMany({
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
});
const getAMeal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.meal.findUnique({
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
});
const updateMeal = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (payload.items && payload.items.length < 3) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal must have at least 3 items to be complete.');
    }
    if (payload.items) {
        const items = yield prisma_1.default.item.findMany({
            where: {
                itemId: { in: payload.items },
            },
        });
        const hasRice = items.some(item => item.category === 'Starch');
        const proteinItems = items.filter(item => item.category === 'Protein');
        if (!hasRice) {
            throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal must have a rice item to be complete.');
        }
        if (proteinItems.length > 1) {
            throw new ApiError_1.default(http_status_1.BAD_REQUEST, 'A meal cannot have two protein sources at a time.');
        }
    }
    const existingMeal = yield prisma_1.default.meal.findUnique({
        where: {
            mealId: id,
        },
        include: {
            items: true,
        },
    });
    if (!existingMeal) {
        throw new ApiError_1.default(http_status_1.BAD_REQUEST, `Meal with id ${id} does not exist.`);
    }
    // Delete the existing items
    yield prisma_1.default.mealItem.deleteMany({
        where: {
            mealId: id,
        },
    });
    // Update the meal and create new items
    const result = yield prisma_1.default.meal.update({
        where: {
            mealId: id,
        },
        data: Object.assign(Object.assign({}, payload), { items: {
                create: ((_a = payload.items) === null || _a === void 0 ? void 0 : _a.map((itemId) => ({
                    item: { connect: { itemId } },
                }))) || [],
            } }),
        include: {
            items: true,
        },
    });
    return result;
});
const deleteMeal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //  Delete related MealItems
    yield prisma_1.default.mealItem.deleteMany({
        where: {
            mealId: id,
        },
    });
    // Delete the meal itself
    const result = yield prisma_1.default.meal.delete({
        where: {
            mealId: id,
        },
        include: {
            items: true,
        },
    });
    return result;
});
exports.MealService = {
    createMeal,
    getAllMeals,
    getAMeal,
    updateMeal,
    deleteMeal,
};
