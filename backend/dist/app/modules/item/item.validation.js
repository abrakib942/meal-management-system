"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemValidation = void 0;
const zod_1 = require("zod");
const createItemZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        category: zod_1.z.enum(['Protein', 'Starch', 'Veg', 'none']),
    }),
});
const updateItemZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        category: zod_1.z.enum(['Protein', 'Starch', 'Veg', 'none']).optional(),
    }),
});
exports.ItemValidation = {
    createItemZodSchema,
    updateItemZodSchema,
};
