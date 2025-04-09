import { integer, pgTable, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// Users
export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    // Temporary fields
}).enableRLS();

export const usersMealsRelations = relations(users, ({ many }) => ({
    meals: many(meals),
}));

// Meals
export const meals = pgTable("meals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    totalCalories: integer().notNull(),
    mealBody: jsonb().notNull(),
    label: varchar({ length: 255 }).notNull(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    dateTimeAdded: timestamp(({ precision: 2, withTimezone: true })).defaultNow().notNull(),
    lastEdited: timestamp(({ precision: 2, withTimezone: true })),
}).enableRLS();

export const mealsUsersRelations = relations(meals, ({ one }) => ({
    user: one(users, {
        fields: [meals.userId],
        references: [users.id],
    }),
}));


// Recipes