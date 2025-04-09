import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" }); // Load your environment variables

// Initialize the PostgreSQL client
const client = postgres(process.env.DATABASE_URL!);

// Initialize Drizzle with the client
export const db = drizzle(client);

// Import your schema here
import { users, meals } from "./schema/schema";

// type NewUser = typeof users.$inferInsert;
type MealSchema = typeof meals.$inferInsert;

// * Functions
// * Function to create commit a meal to the database
// The function is passed the [mealPad] as a JSON string
export async function postMeal(totalCalories: number, label: string, mealBody: string) {
    let meal = {} as MealSchema;
    meal.totalCalories = totalCalories;
    meal.label = label;
    meal.userId = 1; // ! Placeholder for user ID, replace with actual user ID   
    // meal.dateTimeAdded // ! Placeholder for date/time added. The database will handle this automatically but the user might log meals for other days
    meal.mealBody = mealBody;
    try {
        const mealId = await db.insert(meals).values(meal).returning({ id: meals.id });
        return mealId;
    } catch (error) {
        console.error("Error inserting meal:", error);
        return error;
    }
}