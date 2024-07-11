import { z } from 'zod';

const createItemZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    category: z.enum(['Protein', 'Starch', 'Veg', 'none']),
  }),
});

const updateItemZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.enum(['Protein', 'Starch', 'Veg', 'none']).optional(),
  }),
});

export const ItemValidation = {
  createItemZodSchema,
  updateItemZodSchema,
};
