import { z } from 'zod';

const createMealZodSchema = z.object({
  body: z.object({
    mealDay: z.enum(['Sunday', 'Monday', 'TuesDay', 'Wednesday', 'Thursday']),
    item: z.string({
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

export const MealValidation = {
  createMealZodSchema,
};
