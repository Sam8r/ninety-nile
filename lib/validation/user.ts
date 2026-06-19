import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().min(1).max(120),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
  password: z.string().min(10, "Password must be at least 10 characters").max(200),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
