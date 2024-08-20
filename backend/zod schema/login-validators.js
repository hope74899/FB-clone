import { z } from 'zod';
const signup = z.object({
    name: z
        .string({ required_error: "name is required" })
        .trim()
        .min(3, { message: "name must be at least 3 characters long" })
        .max(50, { message: "name must be at most 50 characters long" }),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid Email address" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(50, { message: "Email must be at most 50 characters long" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
});

const login = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid Email address" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }) // Optional: Add length constraint for password
});

export { signup, login };
