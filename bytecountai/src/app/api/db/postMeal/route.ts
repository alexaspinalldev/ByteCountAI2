import { db, meals } from "@/db/index";

// import { z } from "zod";
import { MealSchema } from "@/types";

// * Functions
// * Function to commit a meal to the database
export async function POST(Req: Request) {
    // Parse the request body
    const { mealBody, totalCalories, mealLabel, userId } = await Req.json();

    if (!mealBody || !totalCalories || !mealLabel || !userId) {
        console.error("Invalid request body:", { mealBody, totalCalories, mealLabel, userId });
        return new Response("Invalid request body", { status: 400 });
    }
    // TODO: Check if the user exists?

    let meal = {} as MealSchema;
    meal.totalCalories = totalCalories;
    meal.label = mealLabel;
    meal.userId = userId; // ! Placeholder for user ID, replace with actual user ID   
    // meal.dateTimeAdded // ! Placeholder for date/time added. The database will handle this automatically but the user might log meals for other days
    meal.mealBody = mealBody;
    try {
        const mealId = await db.insert(meals).values(meal).returning({ id: meals.id });
        return new Response(JSON.stringify(mealId), { status: 200 });
    } catch (error) {
        console.error("Error inserting meal:", error);
        return new Response("Error inserting meal", { status: 500 });
    }
}