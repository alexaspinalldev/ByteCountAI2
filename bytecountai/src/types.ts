import { z } from 'zod';
import { users, meals } from '@/db/schema/schema';
export * from "@/db/schema/schema"; // Export the schema for use in other files

export type userSchema = typeof users.$inferInsert;
export type mealSchema = typeof meals.$inferInsert;

export const Fooditem = z.object({
    label: z.string(),
    calories: z.coerce.number(),
    certainty: z.coerce.number(),
});

