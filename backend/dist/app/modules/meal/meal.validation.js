"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealValidation = void 0;
const zod_1 = require("zod");
const createMealZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        mealDay: zod_1.z.enum(['Sunday', 'Monday', 'TuesDay', 'Wednesday', 'Thursday']),
        item: zod_1.z.string({
            required_error: 'itemid is required',
        }),
    }),
});
// const updateItemZodSchema = z.object({
//   body: z.object({
//     name: z.string().optional(),
//     category: z.enum(['Protein', 'Starch', 'Veg', 'none']).optional(),
//   }),
// });
exports.MealValidation = {
    createMealZodSchema,
};
