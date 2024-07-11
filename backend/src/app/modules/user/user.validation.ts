import { z } from 'zod';

const signUpUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    role: z.enum(['user', 'admin', 'super_admin']).optional(),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});
const updateUserZodSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    name: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(),
  }),
});

export const UserValidation = {
  signUpUserZodSchema,
  loginUserZodSchema,
  updateUserZodSchema,
};
