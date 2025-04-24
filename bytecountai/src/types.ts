import { z } from 'zod';
import { users, meals } from '@/db/schema/schema';

export * from "@/db/schema/schema"; // Export the schema for use in other files
export const Fooditem = z.object({
    label: z.string(),
    calories: z.coerce.number(),
    certainty: z.coerce.number(),
});

export type userSchema = typeof users.$inferInsert;
export type MealSchema = Omit<typeof meals.$inferSelect, 'mealBody'> & { mealBody: z.infer<typeof Fooditem>[] };


