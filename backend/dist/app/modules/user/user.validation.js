"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const signUpUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        email: zod_1.z.string({
            required_error: 'email is required',
        }),
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
        role: zod_1.z.enum(['user', 'admin', 'super_admin']).optional(),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'email is required',
        }),
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        role: zod_1.z.enum(['user', 'admin']).optional(),
    }),
});
exports.UserValidation = {
    signUpUserZodSchema,
    loginUserZodSchema,
    updateUserZodSchema,
};
